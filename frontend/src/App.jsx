import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Search, Ticket, Trash2, TrainFront } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

const initialBookingForm = {
  passengerName: '',
  passengerEmail: '',
  seatsBooked: 1
};

function App() {
  const [search, setSearch] = useState({ source: 'Delhi', destination: 'Mumbai' });
  const [trains, setTrains] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [bookingForm, setBookingForm] = useState(initialBookingForm);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTrains();
    loadBookings();
  }, []);

  const selectedTotal = useMemo(() => {
    if (!selectedTrain) {
      return 0;
    }
    return Number(selectedTrain.fare) * Number(bookingForm.seatsBooked || 0);
  }, [selectedTrain, bookingForm.seatsBooked]);

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

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const params = new URLSearchParams(search);
      const data = await request(`/trains/search?${params.toString()}`);
      setTrains(data);
      setSelectedTrain(null);
      setMessage(data.length ? `${data.length} train(s) found.` : 'No trains found for this route.');
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
          seatsBooked: Number(bookingForm.seatsBooked)
        })
      });
      setBookingForm(initialBookingForm);
      setSelectedTrain(null);
      await loadTrains();
      await loadBookings();
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

  return (
    <main className="app-shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Java Fullstack</p>
          <h1>Train Booking System</h1>
        </div>
        <div className="stat">
          <TrainFront size={20} />
          <span>{trains.length} trains</span>
        </div>
      </section>

      <section className="workspace">
        <div className="panel">
          <div className="panel-title">
            <Search size={18} />
            <h2>Search Trains</h2>
          </div>

          <form className="grid-form" onSubmit={handleSearch}>
            <label>
              Source
              <input
                value={search.source}
                onChange={(event) => setSearch({ ...search, source: event.target.value })}
                placeholder="Delhi"
              />
            </label>
            <label>
              Destination
              <input
                value={search.destination}
                onChange={(event) => setSearch({ ...search, destination: event.target.value })}
                placeholder="Mumbai"
              />
            </label>
            <button disabled={loading} type="submit">
              <Search size={16} />
              Search
            </button>
          </form>

          {message && <div className="message">{message}</div>}

          <div className="train-list">
            {trains.map((train) => (
              <button
                className={`train-card ${selectedTrain?.id === train.id ? 'active' : ''}`}
                key={train.id}
                onClick={() => setSelectedTrain(train)}
                type="button"
              >
                <div>
                  <strong>{train.trainName}</strong>
                  <span>{train.trainNumber}</span>
                </div>
                <div className="route">
                  {train.source} to {train.destination}
                </div>
                <div className="meta">
                  <span>
                    <CalendarClock size={15} />
                    {train.departureTime} - {train.arrivalTime}
                  </span>
                  <span>{train.availableSeats} seats</span>
                  <span>Rs. {train.fare}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">
            <Ticket size={18} />
            <h2>Create Booking</h2>
          </div>

          <div className="selected-train">
            {selectedTrain ? (
              <>
                <strong>{selectedTrain.trainName}</strong>
                <span>{selectedTrain.source} to {selectedTrain.destination}</span>
              </>
            ) : (
              <span>Select a train from the list</span>
            )}
          </div>

          <form className="booking-form" onSubmit={handleBooking}>
            <label>
              Passenger Name
              <input
                required
                value={bookingForm.passengerName}
                onChange={(event) => setBookingForm({ ...bookingForm, passengerName: event.target.value })}
                placeholder="Aman Sharma"
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                value={bookingForm.passengerEmail}
                onChange={(event) => setBookingForm({ ...bookingForm, passengerEmail: event.target.value })}
                placeholder="aman@example.com"
              />
            </label>
            <label>
              Seats
              <input
                min="1"
                required
                type="number"
                value={bookingForm.seatsBooked}
                onChange={(event) => setBookingForm({ ...bookingForm, seatsBooked: event.target.value })}
              />
            </label>
            <div className="fare-box">Total: Rs. {selectedTotal}</div>
            <button disabled={loading || !selectedTrain} type="submit">
              <Ticket size={16} />
              Book Ticket
            </button>
          </form>
        </div>
      </section>

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
                <th>Passenger</th>
                <th>Train</th>
                <th>Route</th>
                <th>Seats</th>
                <th>Fare</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>
                    <strong>{booking.passengerName}</strong>
                    <span>{booking.passengerEmail}</span>
                  </td>
                  <td>{booking.trainName}</td>
                  <td>{booking.route}</td>
                  <td>{booking.seatsBooked}</td>
                  <td>Rs. {booking.totalFare}</td>
                  <td>
                    <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span>
                  </td>
                  <td>
                    <button
                      className="icon-button"
                      disabled={booking.status === 'CANCELLED' || loading}
                      onClick={() => cancelBooking(booking.id)}
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
                  <td className="empty" colSpan="8">No bookings yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default App;

