package com.placeboard.reminder;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @PostMapping
    public ResponseEntity<Reminder> createReminder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Long applicationId,
            @RequestBody Reminder reminder) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reminderService.createReminder(userDetails.getUsername(), applicationId, reminder));
    }

    @GetMapping
    public ResponseEntity<List<Reminder>> getUserReminders(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reminderService.getRemindersForUser(userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long id) {
        reminderService.deleteReminder(id);
        return ResponseEntity.noContent().build();
    }
}
