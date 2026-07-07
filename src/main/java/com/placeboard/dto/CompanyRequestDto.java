package com.placeboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyRequestDto {
    private String name;
    private LocalDate deadline;
    private String jobRole;
    private String jobUrl;
    private String sector;
    private Double minCgpa;
    private String packageRange;
    private String bond;
    private String location;
}
