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
}
