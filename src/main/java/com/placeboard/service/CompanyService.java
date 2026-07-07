package com.placeboard.service;

import com.placeboard.dto.CompanyDto;
import com.placeboard.dto.CompanyRequestDto;
import com.placeboard.entity.Company;
import com.placeboard.entity.Application;
import com.placeboard.auth.User;
import com.placeboard.repository.CompanyRepository;
import com.placeboard.repository.ApplicationRepository;
import com.placeboard.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<CompanyDto> getNotAppliedCompanies(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return companyRepository.findAll().stream()
                .filter(company -> !applicationRepository.existsByUserIdAndCompanyId(user.getId(), company.getId()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<CompanyDto> getAppliedCompanies(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return companyRepository.findAll().stream()
                .filter(company -> applicationRepository.existsByUserIdAndCompanyId(user.getId(), company.getId()))
                .map(company -> {
                    CompanyDto dto = mapToDto(company);
                    applicationRepository.findByUserIdAndCompanyId(user.getId(), company.getId())
                            .ifPresent(app -> dto.setCurrentStatus(app.getStatus()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public CompanyDto createCompany(CompanyRequestDto companyRequestDto) {
        Company company = Company.builder()
                .name(companyRequestDto.getName())
                .deadline(companyRequestDto.getDeadline())
                .jobRole(companyRequestDto.getJobRole())
                .jobUrl(companyRequestDto.getJobUrl())
                .sector(companyRequestDto.getSector())
                .minCgpa(companyRequestDto.getMinCgpa())
                .packageRange(companyRequestDto.getPackageRange())
                .bond(companyRequestDto.getBond())
                .location(companyRequestDto.getLocation())
                .build();
        
        Company savedCompany = companyRepository.save(company);
        return mapToDto(savedCompany);
    }

    private CompanyDto mapToDto(Company company) {
        return CompanyDto.builder()
                .id(company.getId())
                .name(company.getName())
                .deadline(company.getDeadline())
                .jobRole(company.getJobRole())
                .jobUrl(company.getJobUrl())
                .sector(company.getSector())
                .minCgpa(company.getMinCgpa())
                .packageRange(company.getPackageRange())
                .bond(company.getBond())
                .location(company.getLocation())
                .build();
    }
}
