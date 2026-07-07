package com.placeboard.service;

import com.placeboard.auth.User;
import com.placeboard.auth.UserRepository;
import com.placeboard.dto.ProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDto(user);
    }

    public ProfileDto updateProfile(String email, ProfileDto profileDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(profileDto.getName());
        user.setBranch(profileDto.getBranch());
        user.setCgpa(profileDto.getCgpa());
        user.setSkills(profileDto.getSkills());
        user.setCollege(profileDto.getCollege());
        
        user.setLinkedinUrl(profileDto.getLinkedinUrl());
        user.setGithubUrl(profileDto.getGithubUrl());
        user.setPortfolioUrl(profileDto.getPortfolioUrl());
        user.setResumeUrl(profileDto.getResumeUrl());
        user.setProjectUrls(profileDto.getProjectUrls());
        user.setPhone(profileDto.getPhone());
        user.setBio(profileDto.getBio());

        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }

    private ProfileDto mapToDto(User user) {
        return ProfileDto.builder()
                .name(user.getName())
                .email(user.getEmail())
                .branch(user.getBranch())
                .cgpa(user.getCgpa())
                .skills(user.getSkills())
                .college(user.getCollege())
                .linkedinUrl(user.getLinkedinUrl())
                .githubUrl(user.getGithubUrl())
                .portfolioUrl(user.getPortfolioUrl())
                .resumeUrl(user.getResumeUrl())
                .projectUrls(user.getProjectUrls())
                .phone(user.getPhone())
                .bio(user.getBio())
                .build();
    }
}
