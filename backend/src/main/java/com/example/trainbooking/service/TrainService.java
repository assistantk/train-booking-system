package com.example.trainbooking.service;

import com.example.trainbooking.model.Train;
import com.example.trainbooking.repository.TrainRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainService {
    private final TrainRepository trainRepository;

    public TrainService(TrainRepository trainRepository) {
        this.trainRepository = trainRepository;
    }

    public List<Train> getAllTrains() {
        return trainRepository.findAll();
    }

    public List<Train> searchTrains(String source, String destination) {
        if (source == null || source.isBlank() || destination == null || destination.isBlank()) {
            return trainRepository.findAll();
        }
        return trainRepository.findBySourceIgnoreCaseAndDestinationIgnoreCase(source.trim(), destination.trim());
    }
}

