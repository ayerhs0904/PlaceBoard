package com.placeboard.dto;

import lombok.Data;

@Data
public class ApplicationRequestDto {
    private Long companyId;
    private String role;
    private String notes;
}
