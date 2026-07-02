package com.placeboard.reminder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByRemindAtBeforeAndSentFalse(LocalDateTime now);
    List<Reminder> findByUserId(Long userId);
}
