package com.placeboard.dto;

import com.placeboard.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDto {
    private Long id;
    private Long userId;
    private Long companyId;
    private String companyName;
    private ApplicationStatus status;
    private String role;
    private String jobUrl;
    private String resumeLink;
    private LocalDate appliedDate;
    private String notes;
}
