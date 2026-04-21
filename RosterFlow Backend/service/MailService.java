package com.group10.rosterflow.service;

import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import com.mailjet.client.resource.Emailv31;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Value("${mailjet.api.key.public:9bac2698c4196aa506eff55db3cdd7e7}")
    private String apiKeyPublic;

    @Value("${mailjet.api.key.private:f2806a1d1b7b0d0d7f6c5f6c44e995f2}")
    private String apiKeyPrivate;

    @Value("${mailjet.sender.email:group10.rosterflow@gmail.com}")
    private String senderEmail;

    @Value("${mailjet.sender.name}")
    private String senderName="RosterFlow";

    public void sendPasswordReset(String to, String resetLink, String from) {
        try {
            MailjetClient client = new MailjetClient(apiKeyPublic, apiKeyPrivate);

            String emailFrom = (from != null && !from.isBlank()) ? from : senderEmail;

            MailjetRequest request = new MailjetRequest(Emailv31.resource)
                    .property(Emailv31.MESSAGES, new JSONArray()
                            .put(new JSONObject()
                                    .put(Emailv31.Message.FROM, new JSONObject()
                                            .put("Email", emailFrom)
                                            .put("Name", senderName))
                                    .put(Emailv31.Message.TO, new JSONArray()
                                            .put(new JSONObject()
                                                    .put("Email", to)))
                                    .put(Emailv31.Message.SUBJECT, "Reset your password")
                                    .put(Emailv31.Message.HTMLPART,
                                            "<div style='font-family:Arial,sans-serif'>" +
                                                    "<h3>Reset your password</h3>" +
                                                    "<p>Click the button below to set a new password. This link expires soon.</p>" +
                                                    "<p><a href='" + resetLink + "' style='display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;'>Reset Password</a></p>" +
                                                    "<p>If you didn’t request this, ignore this email.</p>" +
                                                    "</div>"
                                    )
                            ));

            MailjetResponse response = client.post(request);

            System.out.println("Mailjet Response Status: " + response.getStatus());
            System.out.println("Mailjet Response Data: " + response.getData());

            if (response.getStatus() != 200) {
                throw new RuntimeException("Failed to send reset email via Mailjet: " + response.getData());
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send reset email via Mailjet", e);
        }
    }
}
