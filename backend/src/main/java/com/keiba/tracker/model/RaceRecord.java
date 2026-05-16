package com.keiba.tracker.model;

public record RaceRecord(
    Long id,
    String date,
    long stake,
    long payout,
    String note
) {}
