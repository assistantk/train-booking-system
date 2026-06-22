package com.example.trainbooking.dto;

import jakarta.validation.constraints.NotBlank;

public class PaymentRequest {
    @NotBlank
    private String transactionId;

    @NotBlank
    private String gateway;

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getGateway() {
        return gateway;
    }

    public void setGateway(String gateway) {
        this.gateway = gateway;
    }
}
