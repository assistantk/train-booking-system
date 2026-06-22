package com.example.trainbooking.config;

import com.example.trainbooking.model.Train;
import com.example.trainbooking.repository.TrainRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedTrains(TrainRepository trainRepository) {
        return args -> {
            if (trainRepository.count() > 0) {
                return;
            }

            trainRepository.saveAll(createTrainCatalog());
        };
    }

    private List<Train> createTrainCatalog() {
        String[][] routes = {
                {"New Delhi", "NDLS", "Mumbai Central", "MMCT"},
                {"New Delhi", "NDLS", "Bhopal Jn", "BPL"},
                {"New Delhi", "NDLS", "Howrah Jn", "HWH"},
                {"New Delhi", "NDLS", "KSR Bengaluru", "SBC"},
                {"Mumbai Central", "MMCT", "New Delhi", "NDLS"},
                {"Mumbai CSMT", "CSMT", "Howrah Jn", "HWH"},
                {"Mumbai CSMT", "CSMT", "Chennai Central", "MAS"},
                {"Mumbai Central", "MMCT", "Ahmedabad Jn", "ADI"},
                {"KSR Bengaluru", "SBC", "New Delhi", "NDLS"},
                {"KSR Bengaluru", "SBC", "Patna Jn", "PNBE"},
                {"KSR Bengaluru", "SBC", "Hyderabad Decan", "HYB"},
                {"KSR Bengaluru", "SBC", "Chennai Central", "MAS"},
                {"Chennai Central", "MAS", "Mumbai CSMT", "CSMT"},
                {"Chennai Central", "MAS", "Howrah Jn", "HWH"},
                {"Chennai Central", "MAS", "Hyderabad Decan", "HYB"},
                {"Howrah Jn", "HWH", "New Delhi", "NDLS"},
                {"Howrah Jn", "HWH", "Mumbai CSMT", "CSMT"},
                {"Howrah Jn", "HWH", "Chennai Central", "MAS"},
                {"Patna Jn", "PNBE", "New Delhi", "NDLS"},
                {"Hyderabad Decan", "HYB", "KSR Bengaluru", "SBC"}
        };

        String[] names = {
                "Rajdhani Express", "Shatabdi Express", "Duronto Express", "Garib Rath",
                "Jan Shatabdi", "Vande Bharat Express", "Superfast Express", "Mail Express",
                "Sampark Kranti", "Humsafar Express"
        };

        String[] trainTypes = {"Rajdhani", "Shatabdi", "Duronto", "Superfast", "Express", "Vande Bharat"};
        String[] runDays = {"MON TUE WED THU FRI SAT SUN", "MON WED FRI", "TUE THU SAT", "SUN MON WED FRI"};

        List<Train> trains = new ArrayList<>();
        for (int index = 0; index < 100; index++) {
            String[] route = routes[index % routes.length];
            int hour = 5 + (index % 17);
            int minute = (index * 7) % 60;
            int travelHours = 5 + (index % 12);
            LocalTime departure = LocalTime.of(hour, minute);
            LocalTime arrival = departure.plusHours(travelHours).plusMinutes(30);
            String duration = travelHours + "h 30m";
            int seats = 80 + ((index * 11) % 90);
            int fare = 450 + ((index * 125) % 2600);

            trains.add(train(
                    String.valueOf(12000 + index),
                    route[0] + " " + names[index % names.length],
                    route[0],
                    route[1],
                    route[2],
                    route[3],
                    trainTypes[index % trainTypes.length],
                    runDays[index % runDays.length],
                    duration,
                    "PF-" + ((index % 8) + 1),
                    departure.toString(),
                    arrival.toString(),
                    seats,
                    String.valueOf(fare)
            ));
        }
        return trains;
    }

    private Train train(
            String number,
            String name,
            String source,
            String sourceCode,
            String destination,
            String destinationCode,
            String trainType,
            String runDays,
            String duration,
            String platform,
            String departure,
            String arrival,
            int seats,
            String fare
    ) {
        Train train = new Train();
        train.setTrainNumber(number);
        train.setTrainName(name);
        train.setSource(source);
        train.setSourceCode(sourceCode);
        train.setDestination(destination);
        train.setDestinationCode(destinationCode);
        train.setTrainType(trainType);
        train.setRunDays(runDays);
        train.setDuration(duration);
        train.setPlatform(platform);
        train.setDepartureTime(LocalTime.parse(departure));
        train.setArrivalTime(LocalTime.parse(arrival));
        train.setTotalSeats(seats);
        train.setAvailableSeats(seats);
        train.setFare(new BigDecimal(fare));
        return train;
    }
}
