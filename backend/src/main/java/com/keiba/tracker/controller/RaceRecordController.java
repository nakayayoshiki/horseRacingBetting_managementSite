package com.keiba.tracker.controller;

import com.keiba.tracker.model.RaceRecord;
import com.keiba.tracker.model.YearlySummary;
import com.keiba.tracker.service.RaceRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RaceRecordController {

    private final RaceRecordService service;

    public RaceRecordController(RaceRecordService service) {
        this.service = service;
    }

    @GetMapping("/records/year/{year}")
    public List<RaceRecord> getByYear(@PathVariable int year) {
        return service.findByYear(year);
    }

    @GetMapping("/records/date/{date}")
    public ResponseEntity<RaceRecord> getByDate(@PathVariable String date) {
        return service.findByDate(date)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/records")
    public RaceRecord save(@RequestBody Map<String, Object> body) {
        String date   = (String) body.get("date");
        long stake    = toLong(body.get("stake"));
        long payout   = toLong(body.get("payout"));
        String note   = (String) body.get("note");
        return service.save(date, stake, payout, note);
    }

    @DeleteMapping("/records/date/{date}")
    public ResponseEntity<Void> deleteByDate(@PathVariable String date) {
        service.deleteByDate(date);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary/yearly")
    public List<YearlySummary> getYearlySummaries() {
        return service.getYearlySummaries();
    }

    @GetMapping("/summary/year/{year}")
    public ResponseEntity<YearlySummary> getYearlySummary(@PathVariable int year) {
        return service.getYearlySummary(year)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    private long toLong(Object val) {
        if (val == null) return 0L;
        if (val instanceof Integer i) return i.longValue();
        if (val instanceof Long l) return l;
        return Long.parseLong(String.valueOf(val));
    }
}
