package com.placeboard.controller;

import com.placeboard.dto.ProfileDto;
import com.placeboard.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileDto> getProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.getProfile(email));
    }

    @PutMapping
    public ResponseEntity<ProfileDto> updateProfile(Authentication authentication, @RequestBody ProfileDto profileDto) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.updateProfile(email, profileDto));
    }
}
