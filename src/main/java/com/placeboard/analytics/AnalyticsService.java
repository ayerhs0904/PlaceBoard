package com.placeboard.analytics;

import com.placeboard.auth.User;
import com.placeboard.auth.UserRepository;
import com.placeboard.entity.Application;
import com.placeboard.entity.ApplicationStatus;
import com.placeboard.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public AnalyticsResponse getSummary(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Application> apps = applicationRepository.findByUserId(user.getId());

        long totalApplied = apps.size();
        long shortlisted = apps.stream().filter(a -> a.getStatus() == ApplicationStatus.SHORTLISTED).count();
        long interviews = apps.stream().filter(a -> a.getStatus() == ApplicationStatus.INTERVIEW).count();
        long offers = apps.stream().filter(a -> a.getStatus() == ApplicationStatus.OFFER).count();
        long rejected = apps.stream().filter(a -> a.getStatus() == ApplicationStatus.REJECTED).count();

        Map<ApplicationStatus, Long> statusCounts = apps.stream()
                .filter(a -> a.getStatus() != null)
                .collect(Collectors.groupingBy(Application::getStatus, Collectors.counting()));

        List<AnalyticsResponse.StatusCount> statusDistribution = statusCounts.entrySet().stream()
                .map(e -> AnalyticsResponse.StatusCount.builder()
                        .status(e.getKey().name())
                        .count(e.getValue())
                        .build())
                .collect(Collectors.toList());

        // applications by week for last 8 weeks
        LocalDate now = LocalDate.now();
        LocalDate eightWeeksAgo = now.minusWeeks(8);

        Map<String, Long> weeklyCounts = apps.stream()
                .filter(a -> a.getAppliedDate() != null && !a.getAppliedDate().isBefore(eightWeeksAgo))
                .collect(Collectors.groupingBy(
                        a -> getWeekLabel(a.getAppliedDate()),
                        Collectors.counting()
                ));

        List<AnalyticsResponse.WeekCount> applicationsByWeek = new ArrayList<>();
        // Pre-fill the last 8 weeks to ensure zeros are present
        for (int i = 7; i >= 0; i--) {
            LocalDate weekDate = now.minusWeeks(i);
            String label = getWeekLabel(weekDate);
            applicationsByWeek.add(AnalyticsResponse.WeekCount.builder()
                    .week(label)
                    .count(weeklyCounts.getOrDefault(label, 0L))
                    .build());
        }

        return AnalyticsResponse.builder()
                .totalApplied(totalApplied)
                .shortlisted(shortlisted)
                .interviews(interviews)
                .offers(offers)
                .rejected(rejected)
                .statusDistribution(statusDistribution)
                .applicationsByWeek(applicationsByWeek)
                .build();
    }

    private String getWeekLabel(LocalDate date) {
        WeekFields weekFields = WeekFields.ISO;
        int weekNumber = date.get(weekFields.weekOfWeekBasedYear());
        return "W" + weekNumber + " " + date.getYear();
    }
}
