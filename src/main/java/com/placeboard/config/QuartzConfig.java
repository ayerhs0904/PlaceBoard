package com.placeboard.config;

import com.placeboard.reminder.ReminderJob;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuartzConfig {

    @Bean
    public JobDetail reminderJobDetail() {
        return JobBuilder.newJob(ReminderJob.class)
                .withIdentity("reminderJob")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger reminderJobTrigger(JobDetail reminderJobDetail) {
        return TriggerBuilder.newTrigger()
                .forJob(reminderJobDetail)
                .withIdentity("reminderTrigger")
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                        .withIntervalInHours(1)
                        .repeatForever())
                .build();
    }
}
