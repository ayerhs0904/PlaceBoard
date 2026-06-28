package com.placeboard.service;

import com.placeboard.auth.User;
import com.placeboard.auth.UserRepository;
import com.placeboard.dto.ApplicationDto;
import com.placeboard.dto.ApplicationRequestDto;
import com.placeboard.entity.Application;
import com.placeboard.entity.ApplicationStatus;
import com.placeboard.entity.Company;
import com.placeboard.repository.ApplicationRepository;
import com.placeboard.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public List<ApplicationDto> getUserApplications(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return applicationRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ApplicationDto createApplication(String email, ApplicationRequestDto request) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Application application = Application.builder()
                .user(user)
                .company(company)
                .status(ApplicationStatus.APPLIED)
                .role(request.getRole())
                .appliedDate(LocalDate.now())
                .notes(request.getNotes())
                .build();

        Application savedApplication = applicationRepository.save(application);
        return mapToDto(savedApplication);
    }

    public ApplicationDto getApplicationById(Long id, String email) {
        // Checking if user owns application could be added here
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return mapToDto(application);
    }

    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }

    public ApplicationDto updateApplicationStatus(Long id, ApplicationStatus newStatus) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        application.setStatus(newStatus);
        Application updatedApplication = applicationRepository.save(application);
        return mapToDto(updatedApplication);
    }

    private ApplicationDto mapToDto(Application application) {
        return ApplicationDto.builder()
                .id(application.getId())
                .userId(application.getUser().getId())
                .companyId(application.getCompany().getId())
                .companyName(application.getCompany().getName())
                .status(application.getStatus())
                .role(application.getRole())
                .appliedDate(application.getAppliedDate())
                .notes(application.getNotes())
                .build();
    }
}
