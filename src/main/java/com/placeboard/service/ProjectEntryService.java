package com.placeboard.service;

import com.placeboard.auth.User;
import com.placeboard.auth.UserRepository;
import com.placeboard.dto.ProjectEntryDto;
import com.placeboard.entity.ProjectEntry;
import com.placeboard.repository.ProjectEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectEntryService {

    private final ProjectEntryRepository projectEntryRepository;
    private final UserRepository userRepository;

    public List<ProjectEntryDto> getUserProjects(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return projectEntryRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProjectEntryDto createProject(String email, ProjectEntryDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        ProjectEntry entry = ProjectEntry.builder()
                .projectName(dto.getProjectName())
                .projectLink(dto.getProjectLink())
                .user(user)
                .build();
        
        ProjectEntry saved = projectEntryRepository.save(entry);
        return mapToDto(saved);
    }

    public ProjectEntryDto updateProject(String email, Long id, ProjectEntryDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        ProjectEntry entry = projectEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        if (!entry.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        entry.setProjectName(dto.getProjectName());
        entry.setProjectLink(dto.getProjectLink());
        
        ProjectEntry saved = projectEntryRepository.save(entry);
        return mapToDto(saved);
    }

    public void deleteProject(String email, Long id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        ProjectEntry entry = projectEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        if (!entry.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        projectEntryRepository.delete(entry);
    }

    private ProjectEntryDto mapToDto(ProjectEntry entry) {
        return ProjectEntryDto.builder()
                .id(entry.getId())
                .projectName(entry.getProjectName())
                .projectLink(entry.getProjectLink())
                .build();
    }
}
