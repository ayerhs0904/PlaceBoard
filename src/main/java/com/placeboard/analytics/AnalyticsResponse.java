package com.placeboard.analytics;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AnalyticsResponse {
    private long totalApplied;
    private long shortlisted;
    private long interviews;
    private long offers;
    private long rejected;
    private List<StatusCount> statusDistribution;
    private List<WeekCount> applicationsByWeek;

    @Data
    @Builder
    public static class StatusCount {
        private String status;
        private long count;
    }

    @Data
    @Builder
    public static class WeekCount {
        private String week;
        private long count;
    }
}
