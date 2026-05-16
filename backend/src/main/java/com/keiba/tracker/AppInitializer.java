package com.keiba.tracker;

import com.keiba.tracker.service.RaceRecordService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class AppInitializer implements ApplicationRunner {

    private final RaceRecordService service;

    public AppInitializer(RaceRecordService service) {
        this.service = service;
    }

    @Override
    public void run(ApplicationArguments args) {
        service.initializeSchema();
    }
}
