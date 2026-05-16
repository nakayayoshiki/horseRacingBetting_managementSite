package com.keiba.tracker.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record TursoResponse(List<Result> results) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Result(String type, Response response, TursoError error) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Response(String type, ExecuteResult result) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ExecuteResult(
        List<Column> cols,
        List<List<Value>> rows,
        Long affected_row_count,
        String last_insert_rowid
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Column(String name, String decltype) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Value(String type, String value) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TursoError(String message, String code) {}
}
