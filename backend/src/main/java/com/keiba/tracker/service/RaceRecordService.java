package com.keiba.tracker.service;

import com.keiba.tracker.client.TursoClient;
import com.keiba.tracker.model.RaceRecord;
import com.keiba.tracker.model.YearlySummary;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RaceRecordService {

    private final TursoClient tursoClient;

    public RaceRecordService(TursoClient tursoClient) {
        this.tursoClient = tursoClient;
    }

    public void initializeSchema() {
        tursoClient.executeUpdate("""
            CREATE TABLE IF NOT EXISTS race_records (
                id      INTEGER PRIMARY KEY AUTOINCREMENT,
                date    TEXT    NOT NULL UNIQUE,
                stake   INTEGER NOT NULL DEFAULT 0,
                payout  INTEGER NOT NULL DEFAULT 0,
                note    TEXT,
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now'))
            )
        """);
    }

    public List<RaceRecord> findByYear(int year) {
        List<Map<String, Object>> rows = tursoClient.query(
            "SELECT id, date, stake, payout, note FROM race_records " +
            "WHERE strftime('%Y', date) = ? ORDER BY date",
            String.valueOf(year)
        );
        return rows.stream().map(this::mapToRecord).toList();
    }

    public Optional<RaceRecord> findByDate(String date) {
        List<Map<String, Object>> rows = tursoClient.query(
            "SELECT id, date, stake, payout, note FROM race_records WHERE date = ?",
            date
        );
        return rows.stream().findFirst().map(this::mapToRecord);
    }

    public RaceRecord save(String date, long stake, long payout, String note) {
        tursoClient.executeUpdate("""
            INSERT INTO race_records (date, stake, payout, note, updated_at)
            VALUES (?, ?, ?, ?, datetime('now'))
            ON CONFLICT(date) DO UPDATE SET
                stake      = excluded.stake,
                payout     = excluded.payout,
                note       = excluded.note,
                updated_at = datetime('now')
        """, date, stake, payout, note);
        return findByDate(date).orElseThrow();
    }

    public void deleteByDate(String date) {
        tursoClient.executeUpdate("DELETE FROM race_records WHERE date = ?", date);
    }

    public List<YearlySummary> getYearlySummaries() {
        List<Map<String, Object>> rows = tursoClient.query("""
            SELECT
                CAST(strftime('%Y', date) AS INTEGER) AS year,
                SUM(stake)  AS total_stake,
                SUM(payout) AS total_payout,
                COUNT(*)    AS record_count
            FROM race_records
            GROUP BY strftime('%Y', date)
            ORDER BY year DESC
        """);
        return rows.stream().map(this::mapToYearlySummary).toList();
    }

    public Optional<YearlySummary> getYearlySummary(int year) {
        List<Map<String, Object>> rows = tursoClient.query("""
            SELECT
                CAST(strftime('%Y', date) AS INTEGER) AS year,
                SUM(stake)  AS total_stake,
                SUM(payout) AS total_payout,
                COUNT(*)    AS record_count
            FROM race_records
            WHERE strftime('%Y', date) = ?
            GROUP BY strftime('%Y', date)
        """, String.valueOf(year));
        return rows.stream().findFirst().map(this::mapToYearlySummary);
    }

    private RaceRecord mapToRecord(Map<String, Object> row) {
        return new RaceRecord(
            toLong(row.get("id")),
            (String) row.get("date"),
            toLong(row.get("stake")),
            toLong(row.get("payout")),
            (String) row.get("note")
        );
    }

    private YearlySummary mapToYearlySummary(Map<String, Object> row) {
        long stake  = toLong(row.get("total_stake"));
        long payout = toLong(row.get("total_payout"));
        return new YearlySummary(
            (int) toLong(row.get("year")),
            stake,
            payout,
            payout - stake,
            toLong(row.get("record_count"))
        );
    }

    private long toLong(Object val) {
        if (val == null) return 0L;
        if (val instanceof Long l) return l;
        if (val instanceof Integer i) return i.longValue();
        return Long.parseLong(String.valueOf(val));
    }
}
