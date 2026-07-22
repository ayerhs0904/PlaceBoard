package com.placeboard.controller;

import com.placeboard.dto.ApplicationDto;
import com.placeboard.dto.ApplicationRequestDto;
import com.placeboard.dto.UpdateApplicationStatusDto;
import com.placeboard.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<List<ApplicationDto>> getUserApplications(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getUserApplications(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<ApplicationDto> createApplication(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ApplicationRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applicationService.createApplication(userDetails.getUsername(), requestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> getApplicationById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getApplicationById(id, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationDto> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody UpdateApplicationStatusDto requestDto) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, requestDto.getStatus()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicationDto> updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationRequestDto requestDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.updateApplication(id, requestDto, userDetails.getUsername()));
    }
}
