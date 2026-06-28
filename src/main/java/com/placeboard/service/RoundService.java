package com.placeboard.service;

import com.placeboard.dto.RoundDto;
import com.placeboard.entity.Application;
import com.placeboard.entity.Round;
import com.placeboard.repository.ApplicationRepository;
import com.placeboard.repository.RoundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoundService {

    private final RoundRepository roundRepository;
    private final ApplicationRepository applicationRepository;

    public List<RoundDto> getRoundsByApplication(Long applicationId) {
        return roundRepository.findByApplicationId(applicationId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public RoundDto createRound(Long applicationId, RoundDto roundDto) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Round round = Round.builder()
                .application(application)
                .roundType(roundDto.getRoundType())
                .result(roundDto.getResult())
                .questionsAsked(roundDto.getQuestionsAsked())
                .scheduledAt(roundDto.getScheduledAt())
                .build();

        Round savedRound = roundRepository.save(round);
        return mapToDto(savedRound);
    }

    private RoundDto mapToDto(Round round) {
        return RoundDto.builder()
                .id(round.getId())
                .applicationId(round.getApplication().getId())
                .roundType(round.getRoundType())
                .result(round.getResult())
                .questionsAsked(round.getQuestionsAsked())
                .scheduledAt(round.getScheduledAt())
                .build();
    }
}
