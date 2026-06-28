package com.placeboard.service;

import com.placeboard.dto.CompanyDto;
import com.placeboard.entity.Company;
import com.placeboard.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CompanyDto createCompany(CompanyDto companyDto) {
        Company company = Company.builder()
                .name(companyDto.getName())
                .sector(companyDto.getSector())
                .minCgpa(companyDto.getMinCgpa())
                .packageRange(companyDto.getPackageRange())
                .bond(companyDto.getBond())
                .location(companyDto.getLocation())
                .build();
        
        Company savedCompany = companyRepository.save(company);
        return mapToDto(savedCompany);
    }

    private CompanyDto mapToDto(Company company) {
        return CompanyDto.builder()
                .id(company.getId())
                .name(company.getName())
                .sector(company.getSector())
                .minCgpa(company.getMinCgpa())
                .packageRange(company.getPackageRange())
                .bond(company.getBond())
                .location(company.getLocation())
                .build();
    }
}
