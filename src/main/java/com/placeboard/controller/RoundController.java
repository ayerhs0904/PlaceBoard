package com.placeboard.controller;

import com.placeboard.dto.RoundDto;
import com.placeboard.service.RoundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications/{id}/rounds")
@RequiredArgsConstructor
public class RoundController {

    private final RoundService roundService;

    @GetMapping
    public ResponseEntity<List<RoundDto>> getRoundsByApplication(@PathVariable Long id) {
        return ResponseEntity.ok(roundService.getRoundsByApplication(id));
    }

    @PostMapping
    public ResponseEntity<RoundDto> createRound(
            @PathVariable Long id,
            @RequestBody RoundDto roundDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roundService.createRound(id, roundDto));
    }
}
