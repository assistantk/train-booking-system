package com.example.trainbooking.config;

import com.example.trainbooking.model.Train;
import com.example.trainbooking.repository.TrainRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedTrains(TrainRepository trainRepository) {
        return args -> {
            if (trainRepository.count() > 0) {
                return;
            }

            trainRepository.saveAll(List.of(
                    train("12952", "Mumbai Rajdhani", "Delhi", "Mumbai", "16:55", "08:35", 120, "2650"),
                    train("12002", "Shatabdi Express", "Delhi", "Bhopal", "06:00", "14:25", 90, "1450"),
                    train("12296", "Sanghamitra Express", "Bengaluru", "Patna", "09:15", "20:10", 150, "2100"),
                    train("12627", "Karnataka Express", "Bengaluru", "Delhi", "19:20", "10:30", 130, "2350"),
                    train("12860", "Gitanjali Express", "Mumbai", "Kolkata", "06:00", "12:30", 110, "1980")
            ));
        };
    }

    private Train train(
            String number,
            String name,
            String source,
            String destination,
            String departure,
            String arrival,
            int seats,
            String fare
    ) {
        Train train = new Train();
        train.setTrainNumber(number);
        train.setTrainName(name);
        train.setSource(source);
        train.setDestination(destination);
        train.setDepartureTime(LocalTime.parse(departure));
        train.setArrivalTime(LocalTime.parse(arrival));
        train.setTotalSeats(seats);
        train.setAvailableSeats(seats);
        train.setFare(new BigDecimal(fare));
        return train;
    }
}

