import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CalendarClock,
  LayoutDashboard,
  List,
  LogIn,
  LogOut,
  Search,
  Ticket,
  Trash2,
  TrainFront,
  UserRound
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

const initialBookingForm = {
  passengerName: '',
  passengerEmail: '',
  passengerMobile: '',
  passengerAge: 25,
  passengerGender: 'Male',
  travelClass: 'SL',
  quota: 'General',
  paymentMode: 'UPI',
  seatsBooked: 1
};

const pages = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'trains', label: 'All Trains', icon: TrainFront },
  { id: 'bookings', label: 'Bookings', icon: Ticket },
  { id: 'reports', label: 'Reports', icon: BarChart3 }
];

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('trainBookingUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [activePage, setActivePage] = useState('dashboard');
  const [loginForm, setLoginForm] = useState({ email: 'admin@rail.com', password: 'password123' });
  const [search, setSearch] = useState({ source: 'New Delhi', destination: 'Mumbai Central' });
  const [trains, setTrains] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [bookingForm, setBookingForm] = useState(initialBookingForm);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadTrains();
      loadBookings();
    }
  }, [currentUser]);

  const selectedTotal = useMemo(() => {
    if (!selectedTrain) {
      return 0;
    }
    const multipliers = {
      '1A': 3.2,
      '2A': 2.4,
      '3A': 1.8,
      CC: 1.5,
      SL: 1,
      '2S': 0.75
    };
    return Number(selectedTrain.fare) * Number(bookingForm.seatsBooked || 0) * multipliers[bookingForm.travelClass];
  }, [selectedTrain, bookingForm.seatsBooked, bookingForm.travelClass]);

  const dashboardStats = useMemo(() => {
    const confirmedBookings = bookings.filter((booking) => booking.status === 'CONFIRMED');
    const cancelledBookings = bookings.filter((booking) => booking.status === 'CANCELLED');
    const availableSeats = trains.reduce((total, train) => total + Number(train.availableSeats || 0), 0);
    const revenue = confirmedBookings.reduce((total, booking) => total + Number(booking.totalFare || 0), 0);

    return {
      totalTrains: trains.length,
      confirmedBookings: confirmedBookings.length,
      cancelledBookings: cancelledBookings.length,
      availableSeats,
      revenue
    };
  }, [trains, bookings]);

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async function loadTrains() {
    const data = await request('/trains');
    setTrains(data);
  }

  async function loadBookings() {
    const data = await request('/bookings');
    setBookings(data);
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const user = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginForm)
      });
      localStorage.setItem('trainBookingUser', JSON.stringify(user));
      setCurrentUser(user);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('trainBookingUser');
    setCurrentUser(null);
    setTrains([]);
    setBookings([]);
    setSelectedTrain(null);
    setMessage('');
  }

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const params = new URLSearchParams(search);
      const data = await request(`/trains/search?${params.toString()}`);
      setTrains(data);
      setSelectedTrain(null);
      setActivePage('dashboard');
      setMessage(data.length ? `${data.length} train(s) found.` : 'No trains found for this route.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function showAllTrains() {
    setLoading(true);
    setMessage('');

    try {
      await loadTrains();
      setSelectedTrain(null);
      setActivePage('trains');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleBooking(event) {
    event.preventDefault();

    if (!selectedTrain) {
      setMessage('Please select a train first.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await request('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          trainId: selectedTrain.id,
          passengerName: bookingForm.passengerName,
          passengerEmail: bookingForm.passengerEmail,
          passengerMobile: bookingForm.passengerMobile,
          passengerAge: Number(bookingForm.passengerAge),
          passengerGender: bookingForm.passengerGender,
          travelClass: bookingForm.travelClass,
          quota: bookingForm.quota,
          paymentMode: bookingForm.paymentMode,
          seatsBooked: Number(bookingForm.seatsBooked)
        })
      });
      setBookingForm(initialBookingForm);
      setSelectedTrain(null);
      await loadTrains();
      await loadBookings();
      setActivePage('bookings');
      setMessage('Booking confirmed successfully.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(bookingId) {
    setLoading(true);
    setMessage('');

    try {
      await request(`/bookings/${bookingId}`, { method: 'DELETE' });
      await loadTrains();
      await loadBookings();
      setMessage('Booking cancelled.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function selectTrainForBooking(train) {
    setSelectedTrain(train);
    setActivePage('dashboard');
    setMessage(`${train.trainName} selected for booking.`);
  }

  if (!currentUser) {
    return (
      <main className="login-page">
        <section className="login-panel">
          <div className="login-brand">
            <div className="brand-icon">
              <TrainFront size={30} />
            </div>
            <p className="eyebrow">Train Booking System</p>
            <h1>Login</h1>
            <span>Use the demo railway account to manage trains, PNR bookings, quotas, and reports.</span>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <label>
              Email
              <input
                required
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                placeholder="admin@rail.com"
              />
            </label>
            <label>
              Password
              <input
                required
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                placeholder="password123"
              />
            </label>
            {message && <div className="message">{message}</div>}
            <button disabled={loading} type="submit">
              <LogIn size={16} />
              Login
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Train Booking System</p>
          <h1>Bharat Rail Connect</h1>
        </div>
        <div className="top-actions">
          <div className="stat">
            <TrainFront size={20} />
            <span>{dashboardStats.totalTrains} trains</span>
          </div>
          <div className="user-pill">
            <UserRound size={18} />
            <span>{currentUser.name}</span>
          </div>
          <button className="logout-button" onClick={handleLogout} type="button">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </section>

      <nav className="page-tabs" aria-label="Application pages">
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <button
              className={activePage === page.id ? 'active' : ''}
              key={page.id}
              onClick={() => setActivePage(page.id)}
              type="button"
            >
              <Icon size={16} />
              {page.label}
            </button>
          );
        })}
      </nav>

      {message && <div className="message global-message">{message}</div>}

      {activePage === 'dashboard' && (
        <>
          <section className="summary-grid">
            <StatCard label="Total Trains" value={dashboardStats.totalTrains} />
            <StatCard label="Confirmed Bookings" value={dashboardStats.confirmedBookings} />
            <StatCard label="Available Seats" value={dashboardStats.availableSeats} />
            <StatCard label="Revenue" value={`Rs. ${dashboardStats.revenue}`} />
          </section>

          <section className="workspace">
            <div className="panel">
              <div className="panel-title">
                <Search size={18} />
              <h2>Search Trains Between Stations</h2>
              </div>

              <form className="grid-form" onSubmit={handleSearch}>
                <label>
                  Source
                  <input
                    value={search.source}
                    onChange={(event) => setSearch({ ...search, source: event.target.value })}
                    placeholder="New Delhi"
                  />
                </label>
                <label>
                  Destination
                  <input
                    value={search.destination}
                    onChange={(event) => setSearch({ ...search, destination: event.target.value })}
                    placeholder="Mumbai Central"
                  />
                </label>
                <button disabled={loading} type="submit">
                  <Search size={16} />
                  Search
                </button>
              </form>

              <div className="train-list">
                {trains.slice(0, 12).map((train) => (
                  <TrainCard
                    key={train.id}
                    selected={selectedTrain?.id === train.id}
                    train={train}
                    onSelect={selectTrainForBooking}
                  />
                ))}
              </div>
            </div>

            <BookingPanel
              bookingForm={bookingForm}
              loading={loading}
              onBookingFormChange={setBookingForm}
              onSubmit={handleBooking}
              selectedTotal={selectedTotal}
              selectedTrain={selectedTrain}
            />
          </section>
        </>
      )}

      {activePage === 'trains' && (
        <section className="bookings-section">
          <div className="section-heading">
            <div className="panel-title">
              <List size={18} />
              <h2>All Trains</h2>
            </div>
            <button className="secondary-button" disabled={loading} onClick={showAllTrains} type="button">
              <TrainFront size={16} />
              Reload All
            </button>
          </div>
          <TrainTable trains={trains} onBook={selectTrainForBooking} />
        </section>
      )}

      {activePage === 'bookings' && (
        <BookingsTable bookings={bookings} loading={loading} onCancel={cancelBooking} />
      )}

      {activePage === 'reports' && (
        <section className="reports-grid">
          <StatCard label="Confirmed Bookings" value={dashboardStats.confirmedBookings} />
          <StatCard label="Cancelled Bookings" value={dashboardStats.cancelledBookings} />
          <StatCard label="Open Seats" value={dashboardStats.availableSeats} />
          <StatCard label="Total Revenue" value={`Rs. ${dashboardStats.revenue}`} />
          <div className="panel wide-panel">
            <div className="panel-title">
              <BarChart3 size={18} />
              <h2>System Summary</h2>
            </div>
            <p className="report-copy">
              This admin view now supports a 100 train catalog, route search, direct booking,
              PNR generation, railway class selection, quota selection, cancellation tracking,
              refund status, and booking revenue summary for demo project presentation.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TrainCard({ train, selected, onSelect }) {
  return (
    <button
      className={`train-card ${selected ? 'active' : ''}`}
      onClick={() => onSelect(train)}
      type="button"
    >
      <div>
        <strong>{train.trainName}</strong>
        <span>{train.trainNumber} | {train.trainType}</span>
      </div>
      <div className="route">
        {train.source} ({train.sourceCode}) to {train.destination} ({train.destinationCode})
      </div>
      <div className="meta">
        <span>
          <CalendarClock size={15} />
          {train.departureTime} - {train.arrivalTime} | {train.duration}
        </span>
        <span>{train.availableSeats} seats</span>
        <span>{train.runDays}</span>
        <span>{train.platform}</span>
        <span>Rs. {train.fare}</span>
      </div>
    </button>
  );
}

function BookingPanel({ bookingForm, loading, onBookingFormChange, onSubmit, selectedTotal, selectedTrain }) {
  return (
    <div className="panel">
      <div className="panel-title">
        <Ticket size={18} />
        <h2>Passenger Reservation</h2>
      </div>

      <div className="selected-train">
        {selectedTrain ? (
          <>
            <strong>{selectedTrain.trainName}</strong>
            <span>
              {selectedTrain.sourceCode} to {selectedTrain.destinationCode} | {selectedTrain.trainType}
            </span>
          </>
        ) : (
          <span>Select a train from the list</span>
        )}
      </div>

      <form className="booking-form" onSubmit={onSubmit}>
        <label>
          Passenger Name
          <input
            required
            value={bookingForm.passengerName}
            onChange={(event) => onBookingFormChange({ ...bookingForm, passengerName: event.target.value })}
            placeholder="Aman Sharma"
          />
        </label>
        <label>
          Email
          <input
            required
            type="email"
            value={bookingForm.passengerEmail}
            onChange={(event) => onBookingFormChange({ ...bookingForm, passengerEmail: event.target.value })}
            placeholder="aman@example.com"
          />
        </label>
        <label>
          Mobile
          <input
            required
            value={bookingForm.passengerMobile}
            onChange={(event) => onBookingFormChange({ ...bookingForm, passengerMobile: event.target.value })}
            placeholder="9876543210"
          />
        </label>
        <div className="form-row">
          <label>
            Age
            <input
              min="1"
              required
              type="number"
              value={bookingForm.passengerAge}
              onChange={(event) => onBookingFormChange({ ...bookingForm, passengerAge: event.target.value })}
            />
          </label>
          <label>
            Gender
            <select
              value={bookingForm.passengerGender}
              onChange={(event) => onBookingFormChange({ ...bookingForm, passengerGender: event.target.value })}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            Class
            <select
              value={bookingForm.travelClass}
              onChange={(event) => onBookingFormChange({ ...bookingForm, travelClass: event.target.value })}
            >
              <option value="1A">First AC (1A)</option>
              <option value="2A">AC 2 Tier (2A)</option>
              <option value="3A">AC 3 Tier (3A)</option>
              <option value="SL">Sleeper (SL)</option>
              <option value="CC">Chair Car (CC)</option>
              <option value="2S">Second Sitting (2S)</option>
            </select>
          </label>
          <label>
            Quota
            <select
              value={bookingForm.quota}
              onChange={(event) => onBookingFormChange({ ...bookingForm, quota: event.target.value })}
            >
              <option>General</option>
              <option>Tatkal</option>
              <option>Ladies</option>
              <option>Senior Citizen</option>
            </select>
          </label>
        </div>
        <label>
          Payment Mode
          <select
            value={bookingForm.paymentMode}
            onChange={(event) => onBookingFormChange({ ...bookingForm, paymentMode: event.target.value })}
          >
            <option>UPI</option>
            <option>Debit Card</option>
            <option>Credit Card</option>
            <option>Net Banking</option>
          </select>
        </label>
        <label>
          Seats
          <input
            min="1"
            required
            type="number"
            value={bookingForm.seatsBooked}
            onChange={(event) => onBookingFormChange({ ...bookingForm, seatsBooked: event.target.value })}
          />
        </label>
        <div className="fare-box">Total: Rs. {selectedTotal}</div>
        <button disabled={loading || !selectedTrain} type="submit">
          <Ticket size={16} />
          Book Ticket
        </button>
      </form>
    </div>
  );
}

function TrainTable({ trains, onBook }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Train</th>
            <th>Route</th>
            <th>Time</th>
            <th>Type</th>
            <th>Days</th>
            <th>PF</th>
            <th>Seats</th>
            <th>Fare</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {trains.map((train) => (
            <tr key={train.id}>
              <td>{train.trainNumber}</td>
              <td>{train.trainName}</td>
              <td>{train.sourceCode} to {train.destinationCode}</td>
              <td>{train.departureTime} - {train.arrivalTime}</td>
              <td>{train.trainType}</td>
              <td>{train.runDays}</td>
              <td>{train.platform}</td>
              <td>{train.availableSeats}</td>
              <td>Rs. {train.fare}</td>
              <td>
                <button className="small-action" onClick={() => onBook(train)} type="button">
                  <Ticket size={15} />
                  Book
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BookingsTable({ bookings, loading, onCancel }) {
  return (
    <section className="bookings-section">
      <div className="panel-title">
        <Ticket size={18} />
        <h2>Bookings</h2>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>PNR</th>
              <th>Passenger</th>
              <th>Train</th>
              <th>Route</th>
              <th>Class</th>
              <th>Coach/Berth</th>
              <th>Seats</th>
              <th>Fare</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.pnrNumber}</td>
                <td>
                  <strong>{booking.passengerName}</strong>
                  <span>{booking.passengerAge} | {booking.passengerGender} | {booking.passengerMobile}</span>
                </td>
                <td>{booking.trainName}</td>
                <td>{booking.route}</td>
                <td>{booking.travelClass} | {booking.quota}</td>
                <td>{booking.coach} / {booking.berth}</td>
                <td>{booking.seatsBooked}</td>
                <td>Rs. {booking.totalFare}</td>
                <td>{booking.paymentStatus}</td>
                <td>
                  <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span>
                </td>
                <td>
                  <button
                    className="icon-button"
                    disabled={booking.status === 'CANCELLED' || loading}
                    onClick={() => onCancel(booking.id)}
                    title="Cancel booking"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!bookings.length && (
              <tr>
                <td className="empty" colSpan="12">No bookings yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default App;
