package com.example.trainbooking.controller;

import com.example.trainbooking.model.Train;
import com.example.trainbooking.service.TrainService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
public class TrainController {
    private final TrainService trainService;

    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    @GetMapping
    public List<Train> getAllTrains() {
        return trainService.getAllTrains();
    }

    @GetMapping("/search")
    public List<Train> searchTrains(
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String destination
    ) {
        return trainService.searchTrains(source, destination);
    }
}

