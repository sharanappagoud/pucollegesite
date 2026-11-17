package com.college.website.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class WhatsAppSendRequestDto {

    @NotBlank(message = "Recipient phone number is required")
    private String recipientPhone;

    private String recipientName;
    private String templateName;
    private List<String> parameters;
    private String customMessage;
    private String referenceType = "MANUAL";
    private String referenceId;

    public WhatsAppSendRequestDto() {}

    public String getRecipientPhone() { return recipientPhone; }
    public void setRecipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getTemplateName() { return templateName; }
    public void setTemplateName(String templateName) { this.templateName = templateName; }

    public List<String> getParameters() { return parameters; }
    public void setParameters(List<String> parameters) { this.parameters = parameters; }

    public String getCustomMessage() { return customMessage; }
    public void setCustomMessage(String customMessage) { this.customMessage = customMessage; }

    public String getReferenceType() { return referenceType; }
    public void setReferenceType(String referenceType) { this.referenceType = referenceType; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
}
