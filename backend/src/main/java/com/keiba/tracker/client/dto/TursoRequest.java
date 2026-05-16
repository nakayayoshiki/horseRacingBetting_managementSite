package com.keiba.tracker.client.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record TursoRequest(List<Request> requests) {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Request(String type, Statement stmt) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Statement(String sql, List<Arg> args) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Arg(String type, String value) {}
}
