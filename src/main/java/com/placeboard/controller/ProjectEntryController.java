package com.placeboard.controller;

import com.placeboard.dto.ProjectEntryDto;
import com.placeboard.service.ProjectEntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile/projects")
@RequiredArgsConstructor
public class ProjectEntryController {

    private final ProjectEntryService projectEntryService;

    @GetMapping
    public ResponseEntity<List<ProjectEntryDto>> getUserProjects(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectEntryService.getUserProjects(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<ProjectEntryDto> createProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ProjectEntryDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectEntryService.createProject(userDetails.getUsername(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectEntryDto> updateProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody ProjectEntryDto dto) {
        return ResponseEntity.ok(projectEntryService.updateProject(userDetails.getUsername(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        projectEntryService.deleteProject(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
