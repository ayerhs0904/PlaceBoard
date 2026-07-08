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

@Service
public class AIService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final ChatLanguageModel chatLanguageModel;
    private final ObjectMapper objectMapper;

    public AIService(UserRepository userRepository, 
                     CompanyRepository companyRepository, 
                     @Value("${groq.api.key}") String groqApiKey,
                     ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.objectMapper = objectMapper;
        this.chatLanguageModel = OpenAiChatModel.builder()
                .apiKey(groqApiKey)
                .modelName("llama3-8b-8192")
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
                .map(c -> String.format("{name: '%s', sector: '%s', package: '%s'}", 
                        c.getName(), c.getSector(), c.getPackageRange()))
                .collect(Collectors.joining(", ", "[", "]"));

        String prompt = String.format(
                "Student profile: branch=%s, cgpa=%s, skills=%s\n" +
                "Available companies: %s\n" +
                "Suggest top 5 companies as JSON array:\n" +
                "[{company, sector, reason, matchPercent}]\n" +
                "Return ONLY JSON, no explanation.",
                branch, cgpa, skills, companiesString
        );

        try {
            String response = chatLanguageModel.generate(prompt);
            
            // Clean up possible markdown wrappers around JSON
            if (response.startsWith("```json")) {
                response = response.substring(7);
                if (response.endsWith("```")) {
                    response = response.substring(0, response.length() - 3);
                }
            } else if (response.startsWith("```")) {
                response = response.substring(3);
                if (response.endsWith("```")) {
                    response = response.substring(0, response.length() - 3);
                }
            }
            return objectMapper.readValue(response.trim(), new TypeReference<List<RecommendationDto>>() {});
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }
}
