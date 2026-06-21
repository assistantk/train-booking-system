package com.example.trainbooking.service;

import com.example.trainbooking.dto.BookingResponse;
import com.example.trainbooking.dto.CreateBookingRequest;
import com.example.trainbooking.model.Booking;
import com.example.trainbooking.model.BookingStatus;
import com.example.trainbooking.model.Train;
import com.example.trainbooking.repository.BookingRepository;
import com.example.trainbooking.repository.TrainRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final TrainRepository trainRepository;

    public BookingService(BookingRepository bookingRepository, TrainRepository trainRepository) {
        this.bookingRepository = bookingRepository;
        this.trainRepository = trainRepository;
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(BookingResponse::from)
                .toList();
    }

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        Train train = trainRepository.findById(request.getTrainId())
                .orElseThrow(() -> new IllegalArgumentException("Train not found"));

        if (request.getSeatsBooked() > train.getAvailableSeats()) {
            throw new IllegalArgumentException("Not enough seats available");
        }

        train.setAvailableSeats(train.getAvailableSeats() - request.getSeatsBooked());

        Booking booking = new Booking();
        booking.setPassengerName(request.getPassengerName());
        booking.setPassengerEmail(request.getPassengerEmail());
        booking.setSeatsBooked(request.getSeatsBooked());
        booking.setTotalFare(train.getFare().multiply(java.math.BigDecimal.valueOf(request.getSeatsBooked())));
        booking.setBookedAt(LocalDateTime.now());
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setTrain(train);

        trainRepository.save(train);
        Booking savedBooking = bookingRepository.save(booking);
        return BookingResponse.from(savedBooking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            return BookingResponse.from(booking);
        }

        Train train = booking.getTrain();
        train.setAvailableSeats(train.getAvailableSeats() + booking.getSeatsBooked());
        booking.setStatus(BookingStatus.CANCELLED);

        trainRepository.save(train);
        Booking savedBooking = bookingRepository.save(booking);
        return BookingResponse.from(savedBooking);
    }
}

