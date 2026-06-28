package com.placeboard.dto;

import com.placeboard.entity.ApplicationStatus;
import lombok.Data;

@Data
public class UpdateApplicationStatusDto {
    private ApplicationStatus status;
}
