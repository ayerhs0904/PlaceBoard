package com.placeboard.reminder;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Value("${brevo.sender.name}")
    private String senderName;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendEmail(String to, String subject, String body) {
        String url = "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        Map<String, Object> sender = new HashMap<>();
        sender.put("name", senderName);
        sender.put("email", senderEmail);

        Map<String, Object> toObj = new HashMap<>();
        toObj.put("email", to);
        List<Map<String, Object>> toList = Collections.singletonList(toObj);

        Map<String, Object> payload = new HashMap<>();
        payload.put("sender", sender);
        payload.put("to", toList);
        payload.put("subject", subject);
        payload.put("textContent", body);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        try {
            restTemplate.postForObject(url, entity, String.class);
        } catch (Exception e) {
            e.printStackTrace();
            // In a real app, you might want to log this properly
        }
    }
}
