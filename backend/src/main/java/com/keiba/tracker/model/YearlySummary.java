package com.keiba.tracker.model;

public record YearlySummary(
    int year,
    long totalStake,
    long totalPayout,
    long profit,
    long recordCount
) {}
