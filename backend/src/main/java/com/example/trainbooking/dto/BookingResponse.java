package com.example.trainbooking.dto;

import com.example.trainbooking.model.Booking;
import com.example.trainbooking.model.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponse {
    private Long id;
    private String pnrNumber;
    private String passengerName;
    private String passengerEmail;
    private String passengerMobile;
    private int passengerAge;
    private String passengerGender;
    private String travelClass;
    private String quota;
    private String paymentMode;
    private String paymentStatus;
    private String paymentOrderId;
    private String paymentTransactionId;
    private String paymentGateway;
    private String coach;
    private String berth;
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
        response.setPnrNumber(booking.getPnrNumber());
        response.setPassengerName(booking.getPassengerName());
        response.setPassengerEmail(booking.getPassengerEmail());
        response.setPassengerMobile(booking.getPassengerMobile());
        response.setPassengerAge(booking.getPassengerAge());
        response.setPassengerGender(booking.getPassengerGender());
        response.setTravelClass(booking.getTravelClass());
        response.setQuota(booking.getQuota());
        response.setPaymentMode(booking.getPaymentMode());
        response.setPaymentStatus(booking.getPaymentStatus());
        response.setPaymentOrderId(booking.getPaymentOrderId());
        response.setPaymentTransactionId(booking.getPaymentTransactionId());
        response.setPaymentGateway(booking.getPaymentGateway());
        response.setCoach(booking.getCoach());
        response.setBerth(booking.getBerth());
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

    public String getPnrNumber() {
        return pnrNumber;
    }

    public void setPnrNumber(String pnrNumber) {
        this.pnrNumber = pnrNumber;
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

    public String getPassengerMobile() {
        return passengerMobile;
    }

    public void setPassengerMobile(String passengerMobile) {
        this.passengerMobile = passengerMobile;
    }

    public int getPassengerAge() {
        return passengerAge;
    }

    public void setPassengerAge(int passengerAge) {
        this.passengerAge = passengerAge;
    }

    public String getPassengerGender() {
        return passengerGender;
    }

    public void setPassengerGender(String passengerGender) {
        this.passengerGender = passengerGender;
    }

    public String getTravelClass() {
        return travelClass;
    }

    public void setTravelClass(String travelClass) {
        this.travelClass = travelClass;
    }

    public String getQuota() {
        return quota;
    }

    public void setQuota(String quota) {
        this.quota = quota;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentOrderId() {
        return paymentOrderId;
    }

    public void setPaymentOrderId(String paymentOrderId) {
        this.paymentOrderId = paymentOrderId;
    }

    public String getPaymentTransactionId() {
        return paymentTransactionId;
    }

    public void setPaymentTransactionId(String paymentTransactionId) {
        this.paymentTransactionId = paymentTransactionId;
    }

    public String getPaymentGateway() {
        return paymentGateway;
    }

    public void setPaymentGateway(String paymentGateway) {
        this.paymentGateway = paymentGateway;
    }

    public String getCoach() {
        return coach;
    }

    public void setCoach(String coach) {
        this.coach = coach;
    }

    public String getBerth() {
        return berth;
    }

    public void setBerth(String berth) {
        this.berth = berth;
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
