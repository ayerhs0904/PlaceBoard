package com.placeboard.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.placeboard.auth.User;
import com.placeboard.auth.UserRepository;
import com.placeboard.entity.Company;
import com.placeboard.repository.CompanyRepository;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import com.placeboard.repository.ApplicationRepository;
import com.placeboard.entity.Application;
import com.placeboard.dto.ResumeTipDto;
import com.placeboard.dto.ResumeAnalysisDto;

@Service
public class AIService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;
    private final ChatLanguageModel chatLanguageModel;
    private final ObjectMapper objectMapper;

    public AIService(UserRepository userRepository,
            CompanyRepository companyRepository,
            ApplicationRepository applicationRepository,
            @Value("${groq.api.key}") String groqApiKey,
            ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.applicationRepository = applicationRepository;
        this.objectMapper = objectMapper;
        this.chatLanguageModel = OpenAiChatModel.builder()
                .apiKey(groqApiKey)
                .modelName("llama-3.3-70b-versatile")
                .baseUrl("https://api.groq.com/openai/v1")
                .build();
    }

    public List<RecommendationDto> getRecommendations(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Company> companies = companyRepository.findAll();

        if (companies.isEmpty()) {
            return java.util.Collections.emptyList();
        }

        String branch = user.getBranch() != null ? user.getBranch() : "Any";
        Double cgpa = user.getCgpa() != null ? user.getCgpa() : 0.0;
        String skills = user.getSkills() != null && !user.getSkills().isEmpty() ? user.getSkills() : "General";

        String companiesString = companies.stream()
                .map(c -> String.format("{name: '%s', sector: '%s', packageRange: '%s'}",
                        c.getName(),
                        c.getSector() != null ? c.getSector() : "IT",
                        c.getPackageRange() != null ? c.getPackageRange() : "Not specified"))
                .collect(Collectors.joining(", ", "[", "]"));
        String prompt = String.format(
                "You are a placement advisor. Given this student:\n"
                + "Branch: %s, CGPA: %s, Skills: %s\n\n"
                + "Available companies: %s\n\n"
                + "Return EXACTLY this JSON format, nothing else:\n"
                + "[{\"company\":\"name\",\"sector\":\"sector\",\"reason\":\"why\",\"matchPercent\":85}]\n"
                + "Rules:\n"
                + "- Return ONLY a valid JSON array\n"
                + "- No markdown, no explanation\n"
                + "- matchPercent must be a number 0-100\n"
                + "- Suggest maximum 5 companies",
                branch, cgpa, skills, companiesString);

        try {
            String response = chatLanguageModel.generate(prompt);

            // Clean up possible markdown wrappers around JSON
            response = response.trim().replaceAll("```json", "").replaceAll("```", "").trim();
            
            return objectMapper.readValue(response.trim(), new TypeReference<List<RecommendationDto>>() {
            });
        } catch (Exception e) {
            System.out.println("AI ERROR: " + e.getMessage());
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }

    public List<ResumeTipDto> resumeTips(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Application> applications = applicationRepository.findByUserId(user.getId());
        
        String branch = user.getBranch() != null ? user.getBranch() : "Any";
        Double cgpa = user.getCgpa() != null ? user.getCgpa() : 0.0;
        String skills = user.getSkills() != null && !user.getSkills().isEmpty() ? user.getSkills() : "None";

        String rolesString = "General Tips";
        if (applications != null && !applications.isEmpty()) {
            rolesString = applications.stream()
                    .filter(a -> a.getCompany() != null && a.getRole() != null)
                    .map(a -> a.getCompany().getName() + " - " + a.getRole())
                    .distinct()
                    .collect(Collectors.joining(", "));
            if (rolesString.isEmpty()) {
                rolesString = "General Tips";
            }
        }

        String prompt = String.format(
                "Student: branch=%s, cgpa=%s, skills=%s\n"
                + "Applied roles: %s\n\n"
                + "Give exactly 5 resume improvement tips.\n"
                + "Return ONLY this JSON, nothing else:\n"
                + "[{\"tip\":\"Add Spring Boot projects\",\"priority\":\"HIGH\",\"category\":\"Skills\"}]\n\n"
                + "priority values: HIGH, MEDIUM, LOW\n"
                + "category values: Skills, Projects, Experience, Format, Links",
                branch, cgpa, skills, rolesString);

        try {
            String response = chatLanguageModel.generate(prompt);
            
            int startIndex = response.indexOf("[");
            int endIndex = response.lastIndexOf("]");
            
            if (startIndex != -1 && endIndex != -1 && endIndex >= startIndex) {
                response = response.substring(startIndex, endIndex + 1);
            } else {
                response = "[]";
            }
            
            return objectMapper.readValue(response, new com.fasterxml.jackson.core.type.TypeReference<List<ResumeTipDto>>() {
            });
        } catch (Exception e) {
            System.out.println("AI ERROR: " + e.getMessage());
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }

    public ResumeAnalysisDto analyzeResume(String email, String jobRole) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String branch = user.getBranch() != null ? user.getBranch() : "Any";
        String skills = user.getSkills() != null && !user.getSkills().isEmpty() ? user.getSkills() : "None";

        String prompt = String.format(
                "Job Role: %s\n"
                + "Student Skills: %s\n"
                + "Branch: %s\n\n"
                + "Analyze if this student is suitable for %s.\n"
                + "Return ONLY this JSON:\n"
                + "{\n"
                + "  \"matchScore\": 75,\n"
                + "  \"missingSkills\": [\"Python\",\"Machine Learning\"],\n"
                + "  \"presentSkills\": [\"SQL\",\"Excel\"],\n"
                + "  \"suggestions\": [\n"
                + "    {\"tip\": \"Learn Python basics\", \"priority\": \"HIGH\"},\n"
                + "    {\"tip\": \"Add projects\", \"priority\": \"MEDIUM\"}\n"
                + "  ]\n"
                + "}\n"
                + "Return ONLY valid JSON nothing else.",
                jobRole, skills, branch, jobRole);

        try {
            String response = chatLanguageModel.generate(prompt);
            
            int startIndex = response.indexOf("{");
            int endIndex = response.lastIndexOf("}");
            
            if (startIndex != -1 && endIndex != -1 && endIndex >= startIndex) {
                response = response.substring(startIndex, endIndex + 1);
            } else {
                response = "{\"matchScore\":0,\"missingSkills\":[],\"presentSkills\":[],\"suggestions\":[]}";
            }
            
            return objectMapper.readValue(response, ResumeAnalysisDto.class);
        } catch (Exception e) {
            System.out.println("AI ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResumeAnalysisDto.builder()
                    .matchScore(0)
                    .missingSkills(List.of())
                    .presentSkills(List.of())
                    .suggestions(List.of())
                    .build();
        }
    }
}
