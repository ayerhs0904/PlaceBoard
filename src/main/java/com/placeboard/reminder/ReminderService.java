package com.placeboard.reminder;

import com.placeboard.auth.User;
import com.placeboard.auth.UserRepository;
import com.placeboard.entity.Application;
import com.placeboard.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public Reminder createReminder(String userEmail, Long applicationId, Reminder reminderDetails) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Application application = null;
        if (applicationId != null) {
            application = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new RuntimeException("Application not found"));
        }

        reminderDetails.setUser(user);
        reminderDetails.setApplication(application);
        reminderDetails.setSent(false);
        return reminderRepository.save(reminderDetails);
    }

    public List<Reminder> getRemindersForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reminderRepository.findByUserId(user.getId());
    }

    public void deleteReminder(Long id) {
        reminderRepository.deleteById(id);
    }
}
