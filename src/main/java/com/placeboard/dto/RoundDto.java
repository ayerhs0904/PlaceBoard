package com.placeboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoundDto {
    private Long id;
    private Long applicationId;
    private String roundType;
    private String result;
    private String questionsAsked;
    private LocalDateTime scheduledAt;
}
