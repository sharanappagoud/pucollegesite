package com.college.website.service;

import com.college.website.entity.AdmissionApplication;
import com.college.website.entity.AdmissionEnquiry;
import com.college.website.repository.CollegeSettingRepository;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.CompletableFuture;

@Service
public class EmailSenderService {

    private static final Logger logger = LoggerFactory.getLogger(EmailSenderService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm:ss");

    private final JavaMailSender mailSender;
    private final CollegeSettingRepository settingRepository;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${app.mail.from:sharanappagoudapolicepatil60@gmail.com}")
    private String fromEmail;

    @Value("${app.mail.admin-notification:sharanappagoudapolicepatil60@gmail.com}")
    private String adminNotificationEmail;

    public EmailSenderService(JavaMailSender mailSender,
                              CollegeSettingRepository settingRepository) {
        this.mailSender = mailSender;
        this.settingRepository = settingRepository;
    }

    public String getRecipientEmail() {
        return settingRepository.findBySettingKey("google_sheets_owner_email")
                .map(s -> s.getSettingValue())
                .filter(v -> v != null && !v.isBlank())
                .orElse(adminNotificationEmail);
    }

    /**
     * Asynchronously sends an admission enquiry notification to the admin inbox
     */
    @Async
    public CompletableFuture<Boolean> sendAdmissionEnquiryAlertAsync(AdmissionEnquiry enquiry) {
        String recipient = getRecipientEmail();
        String subject = "🎓 New Admission Enquiry: " + enquiry.getStudentName() +
                " (" + enquiry.getPreferredCombination() + " - " + enquiry.getReferenceNo() + ")";

        String htmlBody = buildEnquiryHtml(enquiry);

        boolean success = sendHtmlEmail(recipient, subject, htmlBody);
        return CompletableFuture.completedFuture(success);
    }

    /**
     * Asynchronously sends confirmation email to student when they submit an enquiry
     */
    @Async
    public CompletableFuture<Boolean> sendStudentEnquiryConfirmationAsync(AdmissionEnquiry enquiry) {
        if (enquiry.getEmail() == null || enquiry.getEmail().isBlank()) {
            return CompletableFuture.completedFuture(false);
        }

        String recipient = enquiry.getEmail().trim();
        String subject = "🎓 Admission Enquiry Received - Ref: " + enquiry.getReferenceNo() + " | Sri Vidyodaya Composite PU College";
        String htmlBody = buildStudentConfirmationHtml(enquiry);

        boolean success = sendHtmlEmail(recipient, subject, htmlBody);
        return CompletableFuture.completedFuture(success);
    }

    /**
     * Asynchronously sends status update email to student when admin updates status
     */
    @Async
    public CompletableFuture<Boolean> sendStudentStatusUpdateAlertAsync(AdmissionEnquiry enquiry, String oldStatus, String note) {
        if (enquiry.getEmail() == null || enquiry.getEmail().isBlank()) {
            return CompletableFuture.completedFuture(false);
        }

        String recipient = enquiry.getEmail().trim();
        String subject = "📢 Admission Status Update: " + enquiry.getStatus() + " (Ref: " + enquiry.getReferenceNo() + ") | Sri Vidyodaya PU College";
        String htmlBody = buildStudentStatusUpdateHtml(enquiry, oldStatus, note);

        boolean success = sendHtmlEmail(recipient, subject, htmlBody);
        return CompletableFuture.completedFuture(success);
    }

    /**
     * Asynchronously sends a student formal application notification
     */
    @Async
    public CompletableFuture<Boolean> sendApplicationAlertAsync(AdmissionApplication app) {
        String recipient = getRecipientEmail();
        String subject = "📋 New Student Application: " + app.getStudentName() + " (" + app.getApplicationNo() + ")";

        String htmlBody = buildApplicationHtml(app);

        boolean success = sendHtmlEmail(recipient, subject, htmlBody);
        return CompletableFuture.completedFuture(success);
    }

    /**
     * Sends test email to verify SMTP configuration
     */
    public boolean sendTestEmail(String toEmail) {
        String target = (toEmail != null && !toEmail.isBlank()) ? toEmail : getRecipientEmail();
        String subject = "🧪 Admissions Portal - Test Email Notification";
        String htmlBody = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>" +
                "<h2 style='color: #07172C; margin-top: 0;'>Admissions Email Notification System</h2>" +
                "<p>This is a test notification confirming that the backend EmailSenderService is operational.</p>" +
                "<p>Target Inbox: <strong>" + target + "</strong></p>" +
                "<p style='color: #64748b; font-size: 13px;'>Sri Vidyodaya Composite Pre-University College</p>" +
                "</div>";

        return sendHtmlEmail(target, subject, htmlBody);
    }

    /**
     * Sends custom direct email from admin portal to candidate or parent
     */
    public boolean sendCustomEmail(String toEmail, String recipientName, String subject, String messageText) {
        if (toEmail == null || toEmail.isBlank()) {
            return false;
        }
        String effectiveSubject = (subject != null && !subject.isBlank()) 
                ? subject 
                : "Official Communication | Sri Vidyodaya Composite PU College";
        String htmlBody = buildCustomEmailHtml(recipientName, messageText);
        return sendHtmlEmail(toEmail.trim(), effectiveSubject, htmlBody);
    }

    private String buildCustomEmailHtml(String recipientName, String messageText) {
        String name = (recipientName != null && !recipientName.isBlank()) ? recipientName : "Student / Parent";
        String formattedMessage = (messageText != null) ? messageText.replace("\n", "<br/>") : "";
        return "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;'>" +
                "<div style='background-color: #07172C; color: #ffffff; padding: 20px; text-align: center;'>" +
                "<h2 style='margin: 0; color: #D4AF37; font-size: 20px;'>Sri Vidyodaya Composite Pre-University College</h2>" +
                "<p style='margin: 5px 0 0 0; color: #cbd5e1; font-size: 13px;'>Admissions & Student Communications</p>" +
                "</div>" +
                "<div style='padding: 24px; background-color: #ffffff; color: #1e293b; line-height: 1.6;'>" +
                "<p style='font-size: 15px; margin-top: 0;'>Dear <strong>" + name + "</strong>,</p>" +
                "<div style='background-color: #f8fafc; border-left: 4px solid #1e40af; padding: 16px; margin: 18px 0; border-radius: 4px; font-size: 14px; color: #1e293b; line-height: 1.6;'>" +
                formattedMessage +
                "</div>" +
                "<p style='margin-top: 24px; font-size: 13px; color: #64748b; line-height: 1.5;'>" +
                "Warm regards,<br/>" +
                "<strong style='color: #0f172a;'>Admissions Office</strong><br/>" +
                "Sri Vidyodaya Composite Pre-University College<br/>" +
                "Email: admissions@svcpuc.edu.in | Web: www.svcpuc.edu.in" +
                "</p>" +
                "</div>" +
                "</div>";
    }

    public boolean isDirectSmtpConfigured() {
        if (mailEnabled) return true;
        return settingRepository.findBySettingKey("mail_smtp_password")
                .map(s -> s.getSettingValue())
                .filter(v -> v != null && !v.isBlank())
                .isPresent();
    }

    private JavaMailSender resolveMailSender() {
        String customPass = settingRepository.findBySettingKey("mail_smtp_password")
                .map(s -> s.getSettingValue())
                .filter(v -> v != null && !v.isBlank())
                .orElse("");
        if (!customPass.isBlank()) {
            org.springframework.mail.javamail.JavaMailSenderImpl impl = new org.springframework.mail.javamail.JavaMailSenderImpl();
            String host = settingRepository.findBySettingKey("mail_smtp_host")
                    .map(s -> s.getSettingValue()).filter(v -> !v.isBlank()).orElse("smtp.gmail.com");
            String port = settingRepository.findBySettingKey("mail_smtp_port")
                    .map(s -> s.getSettingValue()).filter(v -> !v.isBlank()).orElse("587");
            String username = settingRepository.findBySettingKey("mail_smtp_username")
                    .map(s -> s.getSettingValue()).filter(v -> !v.isBlank()).orElse(fromEmail);

            impl.setHost(host);
            try { impl.setPort(Integer.parseInt(port)); } catch (Exception ex) { impl.setPort(587); }
            impl.setUsername(username);
            impl.setPassword(customPass);

            java.util.Properties props = impl.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.starttls.required", "true");
            props.put("mail.smtp.connectiontimeout", "5000");
            props.put("mail.smtp.timeout", "5000");
            props.put("mail.smtp.writetimeout", "5000");
            return impl;
        }
        return mailSender;
    }

    private boolean sendHtmlEmail(String toEmail, String subject, String htmlContent) {
        if (!isDirectSmtpConfigured()) {
            logger.info("Direct SMTP delivery skipped: SMTP credentials not set (app.mail.enabled=false and mail_smtp_password blank).");
            return false;
        }

        try {
            JavaMailSender activeSender = resolveMailSender();
            MimeMessage message = activeSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String senderFrom = settingRepository.findBySettingKey("mail_smtp_username")
                    .map(s -> s.getSettingValue()).filter(v -> !v.isBlank()).orElse(fromEmail);

            helper.setFrom(senderFrom);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            activeSender.send(message);
            logger.info("Successfully sent email notification to [{}] with subject [{}]", toEmail, subject);
            return true;
        } catch (Exception e) {
            logger.warn("Failed to dispatch email to [{}]: {}", toEmail, e.getMessage());
            return false;
        }
    }

    private String buildEnquiryHtml(AdmissionEnquiry e) {
        String submissionDate = (e.getCreatedAt() != null) ? e.getCreatedAt().format(DATE_FORMATTER) : "N/A";
        return "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;'>" +
                "<div style='background-color: #07172C; color: #ffffff; padding: 20px; text-align: center;'>" +
                "<h2 style='margin: 0; color: #D4AF37; font-size: 20px;'>New Online Admission Enquiry</h2>" +
                "<p style='margin: 5px 0 0 0; color: #cbd5e1; font-size: 13px;'>Sri Vidyodaya Composite Pre-University College</p>" +
                "</div>" +
                "<div style='padding: 24px; background-color: #ffffff; color: #1e293b; line-height: 1.6;'>" +
                "<p style='font-size: 15px; margin-top: 0;'>Dear Admissions Admin,</p>" +
                "<p>A candidate has submitted an online admission enquiry on the website:</p>" +
                "<table style='width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 14px;'>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569; width: 40%;'>Reference No:</td><td style='padding: 8px; font-weight: bold; color: #1e40af;'>" + e.getReferenceNo() + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Student Name:</td><td style='padding: 8px; font-weight: bold;'>" + e.getStudentName() + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Parent / Guardian:</td><td style='padding: 8px;'>" + e.getParentName() + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Student Phone:</td><td style='padding: 8px;'><a href='tel:" + e.getStudentPhone() + "'>" + e.getStudentPhone() + "</a></td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Parent Phone:</td><td style='padding: 8px;'><a href='tel:" + e.getParentPhone() + "'>" + e.getParentPhone() + "</a></td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Parent Email:</td><td style='padding: 8px;'>" + (e.getParentEmail() != null && !e.getParentEmail().isBlank() ? "<a href='mailto:" + e.getParentEmail() + "'>" + e.getParentEmail() + "</a>" : "Not provided") + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Student Email:</td><td style='padding: 8px;'><a href='mailto:" + e.getEmail() + "'>" + e.getEmail() + "</a></td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Stream & Combination:</td><td style='padding: 8px;'><strong>" + e.getPreferredStream() + " (" + e.getPreferredCombination() + ")</strong></td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>10th Qualifying Board:</td><td style='padding: 8px;'>" + e.getBoard() + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Academic Year:</td><td style='padding: 8px;'>" + e.getAcademicYear() + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Residential Address:</td><td style='padding: 8px;'>" + (e.getAddress() != null && !e.getAddress().isBlank() ? e.getAddress() : "Not provided") + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Pincode:</td><td style='padding: 8px;'>" + (e.getPincode() != null && !e.getPincode().isBlank() ? e.getPincode() : "Not provided") + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Referred By:</td><td style='padding: 8px;'>" + (e.getReferredBy() != null && !e.getReferredBy().isBlank() ? e.getReferredBy() : "Direct / None") + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Submission Date:</td><td style='padding: 8px;'>" + submissionDate + "</td></tr>" +
                "<tr><td style='padding: 8px; font-weight: bold; color: #475569;'>Remarks:</td><td style='padding: 8px;'>" + (e.getMessage() != null ? e.getMessage() : "None") + "</td></tr>" +
                "</table>" +
                "<div style='margin-top: 20px; padding: 12px; background-color: #f8fafc; border-left: 4px solid #D4AF37; font-size: 13px; color: #64748b;'>" +
                "✓ Stored in Database<br/>" +
                "✓ View on Admin Portal: <a href='http://localhost:5173/admin/enquiries'>http://localhost:5173/admin/enquiries</a>" +
                "</div>" +
                "</div>" +
                "</div>";
    }

    private String buildApplicationHtml(AdmissionApplication a) {
        String submissionDate = (a.getCreatedAt() != null) ? a.getCreatedAt().format(DATE_FORMATTER) : "N/A";
        return "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;'>" +
                "<div style='background-color: #07172C; color: #ffffff; padding: 20px; text-align: center;'>" +
                "<h2 style='margin: 0; color: #D4AF37; font-size: 20px;'>New Formal Student Application</h2>" +
                "<p style='margin: 5px 0 0 0; color: #cbd5e1; font-size: 13px;'>Sri Vidyodaya Composite Pre-University College</p>" +
                "</div>" +
                "<div style='padding: 24px; background-color: #ffffff; color: #1e293b; line-height: 1.6;'>" +
                "<p style='font-size: 15px; margin-top: 0;'>Dear Admissions Admin,</p>" +
                "<p>A formal student admission application has been registered:</p>" +
                "<table style='width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 14px;'>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Application No:</td><td style='padding: 8px; font-weight: bold; color: #1e40af;'>" + a.getApplicationNo() + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Student Name:</td><td style='padding: 8px; font-weight: bold;'>" + a.getStudentName() + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Gender / DOB:</td><td style='padding: 8px;'>" + a.getGender() + " / " + a.getDob() + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Blood Group:</td><td style='padding: 8px;'>" + a.getBloodGroup() + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Marks Percentage:</td><td style='padding: 8px;'>" + a.getMarksPercentage() + "%</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Status:</td><td style='padding: 8px;'>" + a.getStatus() + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Submitted At:</td><td style='padding: 8px;'>" + submissionDate + "</td></tr>" +
                "</table>" +
                "</div>" +
                "</div>";
    }

    private String buildStudentConfirmationHtml(AdmissionEnquiry e) {
        String submissionDate = (e.getCreatedAt() != null) ? e.getCreatedAt().format(DATE_FORMATTER) : "N/A";
        return "<div style='font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);'>" +
                "<div style='background-color: #07172C; color: #ffffff; padding: 24px; text-align: center;'>" +
                "<h1 style='margin: 0; color: #D4AF37; font-size: 22px; font-weight: 700;'>Sri Vidyodaya Composite PU College</h1>" +
                "<p style='margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;'>Online Admission Enquiry Acknowledgement</p>" +
                "</div>" +
                "<div style='padding: 26px; background-color: #ffffff; color: #1e293b; line-height: 1.6;'>" +
                "<div style='background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 14px 18px; margin-bottom: 20px;'>" +
                "<strong style='color: #065f46; font-size: 15px;'>✓ Your Information Has Been Recorded Successfully!</strong>" +
                "<p style='margin: 4px 0 0 0; color: #047857; font-size: 13px;'>Thank you, <strong>" + e.getStudentName() + "</strong>. We have received your admission enquiry.</p>" +
                "</div>" +
                "<div style='background-color: #f8fafc; border-left: 4px solid #1e40af; padding: 12px 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;'>" +
                "<div><span style='font-size: 12px; color: #64748b; text-transform: uppercase;'>Official Reference No:</span><br/><strong style='font-size: 18px; color: #1e40af; font-family: monospace;'>" + e.getReferenceNo() + "</strong></div>" +
                "<div style='text-align: right;'><span style='font-size: 12px; color: #64748b; text-transform: uppercase;'>Current Status:</span><br/><span style='background-color: #dbeafe; color: #1e40af; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700;'>" + e.getStatus() + "</span></div>" +
                "</div>" +
                "<p style='font-size: 14px; margin-top: 0;'>Here is a summary of the details you submitted:</p>" +
                "<table style='width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;'>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 7px; font-weight: bold; color: #475569; width: 38%;'>Student Name:</td><td style='padding: 7px;'>" + e.getStudentName() + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 7px; font-weight: bold; color: #475569;'>Parent / Guardian:</td><td style='padding: 7px;'>" + e.getParentName() + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 7px; font-weight: bold; color: #475569;'>Mobile Number:</td><td style='padding: 7px;'>" + e.getStudentPhone() + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 7px; font-weight: bold; color: #475569;'>Stream & Combination:</td><td style='padding: 7px;'><strong>" + e.getPreferredStream() + " (" + e.getPreferredCombination() + ")</strong></td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 7px; font-weight: bold; color: #475569;'>Residential Address:</td><td style='padding: 7px;'>" + (e.getAddress() != null && !e.getAddress().isBlank() ? e.getAddress() : "Not provided") + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 7px; font-weight: bold; color: #475569;'>Pincode:</td><td style='padding: 7px;'>" + (e.getPincode() != null && !e.getPincode().isBlank() ? e.getPincode() : "Not provided") + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 7px; font-weight: bold; color: #475569;'>Referred By:</td><td style='padding: 7px;'>" + (e.getReferredBy() != null && !e.getReferredBy().isBlank() ? e.getReferredBy() : "Direct / None") + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 7px; font-weight: bold; color: #475569;'>Submission Date:</td><td style='padding: 7px;'>" + submissionDate + "</td></tr>" +
                "</table>" +
                "<div style='background-color: #fefce8; border: 1px solid #fef08a; border-radius: 6px; padding: 14px; margin-top: 20px; font-size: 13px; color: #854d0e;'>" +
                "<strong>📌 Next Steps:</strong><br/>" +
                "Our Admissions Counselling desk will review your details and contact you or your parent shortly. You can also track your live admission status anytime on our website using your Reference Number: <strong>" + e.getReferenceNo() + "</strong>." +
                "</div>" +
                "<div style='margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;'>" +
                "Sri Vidyodaya Composite PU College • Admissions Department<br/>" +
                "Need help? Contact college administration directly." +
                "</div>" +
                "</div>" +
                "</div>";
    }

    private String buildStudentStatusUpdateHtml(AdmissionEnquiry e, String oldStatus, String note) {
        String updateTime = LocalDateTime.now().format(DATE_FORMATTER);
        String statusColor = "#1e40af";
        String statusBg = "#dbeafe";
        if ("ADMITTED".equalsIgnoreCase(e.getStatus())) {
            statusColor = "#065f46";
            statusBg = "#d1fae5";
        } else if ("REJECTED".equalsIgnoreCase(e.getStatus())) {
            statusColor = "#991b1b";
            statusBg = "#fee2e2";
        } else if ("COUNSELLING_SCHEDULED".equalsIgnoreCase(e.getStatus())) {
            statusColor = "#92400e";
            statusBg = "#fef3c7";
        }

        return "<div style='font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);'>" +
                "<div style='background-color: #07172C; color: #ffffff; padding: 24px; text-align: center;'>" +
                "<h1 style='margin: 0; color: #D4AF37; font-size: 22px; font-weight: 700;'>Sri Vidyodaya Composite PU College</h1>" +
                "<p style='margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;'>Admission Enquiry Status Notification</p>" +
                "</div>" +
                "<div style='padding: 26px; background-color: #ffffff; color: #1e293b; line-height: 1.6;'>" +
                "<p style='font-size: 15px; margin-top: 0;'>Dear <strong>" + e.getStudentName() + "</strong>,</p>" +
                "<p>This is an official update regarding your admission enquiry (Reference No: <strong style='font-family: monospace; color: #1e40af;'>" + e.getReferenceNo() + "</strong>).</p>" +
                "<div style='background-color: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0; text-align: center;'>" +
                "<span style='font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em;'>Updated Admission Status</span>" +
                "<div style='margin-top: 8px;'>" +
                "<span style='display: inline-block; background-color: " + statusBg + "; color: " + statusColor + "; padding: 8px 18px; border-radius: 9999px; font-size: 16px; font-weight: 800; letter-spacing: 0.03em;'>" +
                e.getStatus() +
                "</span>" +
                "</div>" +
                "<div style='font-size: 12px; color: #94a3b8; margin-top: 6px;'>Previous Status: " + (oldStatus != null ? oldStatus : "NEW") + " • Updated: " + updateTime + "</div>" +
                "</div>" +
                (note != null && !note.trim().isEmpty() ?
                        "<div style='background-color: #f1f5f9; border-left: 4px solid #07172C; border-radius: 4px; padding: 14px; margin-bottom: 20px; font-size: 13.5px;'>" +
                        "<strong style='color: #07172C;'>Remarks from Admissions Office:</strong>" +
                        "<p style='margin: 6px 0 0 0; color: #334155; white-space: pre-line;'>" + note + "</p>" +
                        "</div>" : "") +
                "<table style='width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;'>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 6px; font-weight: bold; color: #475569; width: 38%;'>Student Name:</td><td style='padding: 6px;'>" + e.getStudentName() + "</td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 6px; font-weight: bold; color: #475569;'>Stream & Combination:</td><td style='padding: 6px;'><strong>" + e.getPreferredStream() + " (" + e.getPreferredCombination() + ")</strong></td></tr>" +
                "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 6px; font-weight: bold; color: #475569;'>Academic Year:</td><td style='padding: 6px;'>" + e.getAcademicYear() + "</td></tr>" +
                "</table>" +
                "<div style='margin-top: 24px; padding: 14px; background-color: #eff6ff; border-radius: 6px; font-size: 13px; color: #1e40af;'>" +
                "ℹ️ You can also check your live status directly on the college portal by entering your reference number <strong>" + e.getReferenceNo() + "</strong> at <a href='http://localhost:5173/admissions' style='color: #1d4ed8; font-weight: bold;'>Admissions Status Tracker</a>." +
                "</div>" +
                "<div style='margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;'>" +
                "Sri Vidyodaya Composite PU College • Office of Admissions<br/>" +
                "This is an automated notification. Please do not reply directly to this email." +
                "</div>" +
                "</div>" +
                "</div>";
    }
}

