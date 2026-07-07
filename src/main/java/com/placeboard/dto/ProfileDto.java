package com.placeboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {
    private String name;
    private String email;
    private String branch;
    private Double cgpa;
    private String skills;
    private String college;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String resumeUrl;
    private String projectUrls;
    private String phone;
    private String bio;
}
