package com.placeboard.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ApplicationRequestDto {
    private Long companyId;
    private String role;
    private String jobUrl;
    private String notes;
    private LocalDate appliedDate;
}