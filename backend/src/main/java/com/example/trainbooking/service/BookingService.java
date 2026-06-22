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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

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
        booking.setPnrNumber(generatePnrNumber());
        booking.setPassengerName(request.getPassengerName());
        booking.setPassengerEmail(request.getPassengerEmail());
        booking.setPassengerMobile(request.getPassengerMobile());
        booking.setPassengerAge(request.getPassengerAge());
        booking.setPassengerGender(request.getPassengerGender());
        booking.setTravelClass(request.getTravelClass());
        booking.setQuota(request.getQuota());
        booking.setPaymentMode(request.getPaymentMode());
        booking.setPaymentStatus("PAID");
        booking.setCoach(assignCoach(request.getTravelClass()));
        booking.setBerth(assignBerth());
        booking.setSeatsBooked(request.getSeatsBooked());
        booking.setTotalFare(calculateFare(train, request));
        booking.setBookedAt(LocalDateTime.now());
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setTrain(train);

        trainRepository.save(train);
        Booking savedBooking = bookingRepository.save(booking);
        return BookingResponse.from(savedBooking);
    }

    private BigDecimal calculateFare(Train train, CreateBookingRequest request) {
        BigDecimal classMultiplier = switch (request.getTravelClass()) {
            case "1A" -> BigDecimal.valueOf(3.2);
            case "2A" -> BigDecimal.valueOf(2.4);
            case "3A" -> BigDecimal.valueOf(1.8);
            case "CC" -> BigDecimal.valueOf(1.5);
            case "SL" -> BigDecimal.valueOf(1.0);
            default -> BigDecimal.valueOf(0.75);
        };
        return train.getFare()
                .multiply(classMultiplier)
                .multiply(BigDecimal.valueOf(request.getSeatsBooked()));
    }

    private String generatePnrNumber() {
        long number = ThreadLocalRandom.current().nextLong(1_000_000_000L, 9_999_999_999L);
        return String.valueOf(number);
    }

    private String assignCoach(String travelClass) {
        int coachNumber = ThreadLocalRandom.current().nextInt(1, 8);
        return switch (travelClass) {
            case "1A" -> "H" + coachNumber;
            case "2A" -> "A" + coachNumber;
            case "3A" -> "B" + coachNumber;
            case "CC" -> "C" + coachNumber;
            case "SL" -> "S" + coachNumber;
            default -> "D" + coachNumber;
        };
    }

    private String assignBerth() {
        String[] berths = {"LB", "MB", "UB", "SL", "SU", "WS"};
        int berthIndex = ThreadLocalRandom.current().nextInt(berths.length);
        int seatNumber = ThreadLocalRandom.current().nextInt(1, 73);
        return berths[berthIndex] + "-" + seatNumber;
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
        booking.setPaymentStatus("REFUND INITIATED");

        trainRepository.save(train);
        Booking savedBooking = bookingRepository.save(booking);
        return BookingResponse.from(savedBooking);
    }
}
