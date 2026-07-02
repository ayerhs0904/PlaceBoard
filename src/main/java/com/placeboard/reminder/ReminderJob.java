package com.placeboard.reminder;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ReminderJob implements Job {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public void execute(JobExecutionContext context) throws JobExecutionException {
        LocalDateTime now = LocalDateTime.now();
        List<Reminder> dueReminders = reminderRepository.findByRemindAtBeforeAndSentFalse(now);

        for (Reminder reminder : dueReminders) {
            if (reminder.getUser() != null && reminder.getUser().getEmail() != null) {
                String to = reminder.getUser().getEmail();
                String subject = "PlaceBoard Reminder";
                String body = reminder.getMessage();
                
                if (reminder.getApplication() != null) {
                    subject += " - " + reminder.getApplication().getCompany().getName();
                }

                emailService.sendEmail(to, subject, body);

                reminder.setSent(true);
                reminderRepository.save(reminder);
            }
        }
    }
}
