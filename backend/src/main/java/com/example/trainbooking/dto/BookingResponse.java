package com.example.trainbooking.dto;

import com.example.trainbooking.model.Booking;
import com.example.trainbooking.model.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponse {
    private Long id;
    private String passengerName;
    private String passengerEmail;
    private int seatsBooked;
    private BigDecimal totalFare;
    private BookingStatus status;
    private LocalDateTime bookedAt;
    private Long trainId;
    private String trainName;
    private String trainNumber;
    private String route;

    public static BookingResponse from(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setPassengerName(booking.getPassengerName());
        response.setPassengerEmail(booking.getPassengerEmail());
        response.setSeatsBooked(booking.getSeatsBooked());
        response.setTotalFare(booking.getTotalFare());
        response.setStatus(booking.getStatus());
        response.setBookedAt(booking.getBookedAt());
        response.setTrainId(booking.getTrain().getId());
        response.setTrainName(booking.getTrain().getTrainName());
        response.setTrainNumber(booking.getTrain().getTrainNumber());
        response.setRoute(booking.getTrain().getSource() + " to " + booking.getTrain().getDestination());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public String getPassengerEmail() {
        return passengerEmail;
    }

    public void setPassengerEmail(String passengerEmail) {
        this.passengerEmail = passengerEmail;
    }

    public int getSeatsBooked() {
        return seatsBooked;
    }

    public void setSeatsBooked(int seatsBooked) {
        this.seatsBooked = seatsBooked;
    }

    public BigDecimal getTotalFare() {
        return totalFare;
    }

    public void setTotalFare(BigDecimal totalFare) {
        this.totalFare = totalFare;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }

    public Long getTrainId() {
        return trainId;
    }

    public void setTrainId(Long trainId) {
        this.trainId = trainId;
    }

    public String getTrainName() {
        return trainName;
    }

    public void setTrainName(String trainName) {
        this.trainName = trainName;
    }

    public String getTrainNumber() {
        return trainNumber;
    }

    public void setTrainNumber(String trainNumber) {
        this.trainNumber = trainNumber;
    }

    public String getRoute() {
        return route;
    }

    public void setRoute(String route) {
        this.route = route;
    }
}

