package com.keiba.tracker.client;

import com.keiba.tracker.client.dto.TursoRequest;
import com.keiba.tracker.client.dto.TursoResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
public class TursoClient {

    private final RestTemplate restTemplate;

    @Value("${turso.database-url}")
    private String databaseUrl;

    @Value("${turso.auth-token}")
    private String authToken;

    public TursoClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Map<String, Object>> query(String sql, Object... args) {
        TursoResponse response = execute(sql, args);
        TursoResponse.Result first = response.results().get(0);
        if ("error".equals(first.type())) {
            throw new RuntimeException("Turso query error: " + first.error().message());
        }
        TursoResponse.ExecuteResult result = first.response().result();

        List<String> colNames = result.cols().stream()
            .map(TursoResponse.Column::name)
            .toList();

        return result.rows().stream()
            .map(row -> {
                Map<String, Object> map = new LinkedHashMap<>();
                for (int i = 0; i < colNames.size(); i++) {
                    map.put(colNames.get(i), parseValue(row.get(i)));
                }
                return map;
            })
            .toList();
    }

    public long executeUpdate(String sql, Object... args) {
        TursoResponse response = execute(sql, args);
        TursoResponse.Result first = response.results().get(0);
        if ("error".equals(first.type())) {
            throw new RuntimeException("Turso update error: " + first.error().message());
        }
        TursoResponse.ExecuteResult result = first.response().result();
        String lastId = result.last_insert_rowid();
        if (lastId != null) return Long.parseLong(lastId);
        return result.affected_row_count() != null ? result.affected_row_count() : 0L;
    }

    private TursoResponse execute(String sql, Object[] args) {
        List<TursoRequest.Arg> tursoArgs = Arrays.stream(args)
            .map(this::toArg)
            .toList();

        TursoRequest request = new TursoRequest(List.of(
            new TursoRequest.Request("execute",
                new TursoRequest.Statement(sql, tursoArgs)),
            new TursoRequest.Request("close", null)
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(authToken);

        ResponseEntity<TursoResponse> response = restTemplate.postForEntity(
            databaseUrl + "/v2/pipeline",
            new HttpEntity<>(request, headers),
            TursoResponse.class
        );

        return Objects.requireNonNull(response.getBody());
    }

    private TursoRequest.Arg toArg(Object value) {
        if (value == null) return new TursoRequest.Arg("null", null);
        if (value instanceof Integer || value instanceof Long)
            return new TursoRequest.Arg("integer", String.valueOf(value));
        if (value instanceof Double || value instanceof Float)
            return new TursoRequest.Arg("float", String.valueOf(value));
        return new TursoRequest.Arg("text", String.valueOf(value));
    }

    private Object parseValue(TursoResponse.Value v) {
        if (v == null || "null".equals(v.type())) return null;
        return switch (v.type()) {
            case "integer" -> Long.parseLong(v.value());
            case "float" -> Double.parseDouble(v.value());
            default -> v.value();
        };
    }
}
