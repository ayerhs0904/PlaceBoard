package com.placeboard.reminder;

import com.placeboard.auth.User;
import com.placeboard.entity.Application;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reminder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;

    private LocalDateTime remindAt;
    
    private String message;

    @Builder.Default
    private boolean sent = false;
}
