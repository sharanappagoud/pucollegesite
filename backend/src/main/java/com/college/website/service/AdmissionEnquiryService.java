package com.college.website.service;

import com.college.website.dto.AdmissionEnquiryRequest;
import com.college.website.dto.AdmissionEnquiryResponse;
import com.college.website.dto.UpdateEnquiryStatusRequest;
import com.college.website.entity.AdmissionEnquiry;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.mapper.EntityDtoMapper;
import com.college.website.repository.AdmissionEnquiryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class AdmissionEnquiryService {

    private final AdmissionEnquiryRepository enquiryRepository;
    private final EntityDtoMapper mapper;
    private final AuditLogService auditLogService;
    private final GoogleSheetsSyncService googleSheetsSyncService;
    private final EmailSenderService emailSenderService;
    private final CommunicationLogService communicationLogService;

    public AdmissionEnquiryService(AdmissionEnquiryRepository enquiryRepository,
                                   EntityDtoMapper mapper,
                                   AuditLogService auditLogService,
                                   GoogleSheetsSyncService googleSheetsSyncService,
                                   EmailSenderService emailSenderService,
                                   CommunicationLogService communicationLogService) {
        this.enquiryRepository = enquiryRepository;
        this.mapper = mapper;
        this.auditLogService = auditLogService;
        this.googleSheetsSyncService = googleSheetsSyncService;
        this.emailSenderService = emailSenderService;
        this.communicationLogService = communicationLogService;
    }

    @Transactional
    public AdmissionEnquiryResponse createEnquiry(AdmissionEnquiryRequest request) {
        AdmissionEnquiry enquiry = new AdmissionEnquiry();
        String refNumber = generateUniqueReferenceNumber();
        enquiry.setReferenceNo(refNumber);
        enquiry.setStudentName(request.getStudentName());
        enquiry.setParentName(request.getParentName());
        enquiry.setStudentPhone(request.getStudentPhone());
        enquiry.setParentPhone(request.getParentPhone());
        enquiry.setParentEmail(request.getParentEmail());
        enquiry.setEmail(request.getEmail());
        enquiry.setLastCompletedClass(request.getLastCompletedClass());
        enquiry.setBoard(request.getBoard());
        enquiry.setPreferredStream(request.getPreferredStream().toUpperCase());
        enquiry.setPreferredCombination(request.getPreferredCombination().toUpperCase());
        enquiry.setAcademicYear(request.getAcademicYear() != null ? request.getAcademicYear() : "2026-27");
        enquiry.setMessage(request.getMessage());
        enquiry.setAddress(request.getAddress());
        enquiry.setPincode(request.getPincode());
        enquiry.setReferredBy(request.getReferredBy());
        enquiry.setStatus("NEW");
        enquiry.setFollowUpNotes("Online enquiry submitted on " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm")));

        AdmissionEnquiry saved = enquiryRepository.save(enquiry);
        auditLogService.logAction("STUDENT_APPLICANT", "SUBMIT_ENQUIRY", "ADMISSIONS", "Submitted admission enquiry ref: " + refNumber);

        // Forward to Google Spreadsheet in real-time
        try {
            googleSheetsSyncService.forwardEnquiryAsync(saved);
        } catch (Exception e) {
            // Non-blocking fallback
        }

        // Send Email Alert directly to admin inbox
        try {
            emailSenderService.sendAdmissionEnquiryAlertAsync(saved);
        } catch (Exception e) {
            // Non-blocking fallback
        }

        // Send Confirmation Email to the student
        try {
            emailSenderService.sendStudentEnquiryConfirmationAsync(saved);
        } catch (Exception e) {
            // Non-blocking fallback
        }

        // Record Communication History (Staff, Student, and Parent)
        try {
            // 1. Staff Email Log
            communicationLogService.logCommunication(
                    saved.getReferenceNo(),
                    "STAFF",
                    "Admissions Office",
                    emailSenderService.getRecipientEmail(),
                    "EMAIL",
                    "New Admission Enquiry: " + saved.getStudentName() + " (" + saved.getPreferredCombination() + ")",
                    "Admin notification alert dispatched for candidate " + saved.getStudentName() + ". Stream: " + saved.getPreferredStream(),
                    "SENT",
                    "ADMIN_ALERT",
                    null,
                    "SYSTEM"
            );

            // 2. Student Email Log
            communicationLogService.logCommunication(
                    saved.getReferenceNo(),
                    "STUDENT",
                    saved.getStudentName(),
                    saved.getEmail(),
                    "EMAIL",
                    "Admission Enquiry Received - Ref: " + saved.getReferenceNo(),
                    "Your information has been recorded successfully! Reference No: " + saved.getReferenceNo() + ". Status: " + saved.getStatus(),
                    "SENT",
                    "ENQUIRY_CONFIRMATION",
                    null,
                    "SYSTEM"
            );

            // 3. Parent Email / SMS Log
            String parentTarget = (saved.getParentEmail() != null && !saved.getParentEmail().isBlank())
                    ? saved.getParentEmail().trim()
                    : saved.getParentPhone();
            String parentChannel = (saved.getParentEmail() != null && !saved.getParentEmail().isBlank()) ? "EMAIL" : "SMS";

            communicationLogService.logCommunication(
                    saved.getReferenceNo(),
                    "PARENT",
                    saved.getParentName(),
                    parentTarget,
                    parentChannel,
                    "Admission Enquiry Acknowledgement - SVCPUC",
                    "Dear " + saved.getParentName() + ", admission enquiry for " + saved.getStudentName() + " (Ref: " + saved.getReferenceNo() + ") is safely recorded with status: NEW.",
                    "SENT",
                    "ENQUIRY_CONFIRMATION",
                    null,
                    "SYSTEM"
            );
        } catch (Exception e) {
            // Non-blocking fallback
        }

        return mapper.toDto(saved);
    }

    private synchronized String generateUniqueReferenceNumber() {
        int randomNum = 1000 + new Random().nextInt(9000);
        String year = String.valueOf(LocalDateTime.now().getYear());
        String ref = "ADM-" + year + "-" + randomNum;
        while (enquiryRepository.findByReferenceNo(ref).isPresent()) {
            randomNum = 1000 + new Random().nextInt(9000);
            ref = "ADM-" + year + "-" + randomNum;
        }
        return ref;
    }

    public List<AdmissionEnquiryResponse> getAllEnquiries(String status, String stream) {
        List<AdmissionEnquiry> list;
        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            list = enquiryRepository.findByStatus(status.toUpperCase());
        } else if (stream != null && !stream.trim().isEmpty() && !"ALL".equalsIgnoreCase(stream)) {
            list = enquiryRepository.findByPreferredStream(stream.toUpperCase());
        } else {
            list = enquiryRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        }
        return list.stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public Page<AdmissionEnquiryResponse> getPagedEnquiries(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return enquiryRepository.findAll(pageable).map(mapper::toDto);
    }

    public AdmissionEnquiryResponse getEnquiryById(Long id) {
        AdmissionEnquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admission Enquiry", "id", id));
        return mapper.toDto(enquiry);
    }

    public AdmissionEnquiryResponse getEnquiryByReference(String referenceNo) {
        AdmissionEnquiry enquiry = enquiryRepository.findByReferenceNo(referenceNo)
                .orElseThrow(() -> new ResourceNotFoundException("Admission Enquiry", "referenceNo", referenceNo));
        return mapper.toDto(enquiry);
    }

    @Transactional
    public AdmissionEnquiryResponse updateStatus(Long id, UpdateEnquiryStatusRequest request, String adminUsername) {
        AdmissionEnquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admission Enquiry", "id", id));

        String oldStatus = enquiry.getStatus();
        enquiry.setStatus(request.getStatus().toUpperCase());

        if (request.getFollowUpNotes() != null && !request.getFollowUpNotes().trim().isEmpty()) {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm"));
            String newNote = "[" + timestamp + " by " + adminUsername + "]: " + request.getFollowUpNotes();
            if (enquiry.getFollowUpNotes() != null && !enquiry.getFollowUpNotes().trim().isEmpty()) {
                enquiry.setFollowUpNotes(enquiry.getFollowUpNotes() + "\n" + newNote);
            } else {
                enquiry.setFollowUpNotes(newNote);
            }
        }

        AdmissionEnquiry updated = enquiryRepository.save(enquiry);
        auditLogService.logAction(adminUsername, "UPDATE_STATUS", "ADMISSIONS",
                "Updated enquiry " + enquiry.getReferenceNo() + " status from " + oldStatus + " to " + enquiry.getStatus());

        // Forward status update to Google Sheets & Apps Script Webhook
        try {
            googleSheetsSyncService.forwardStatusUpdateAsync(updated, oldStatus, request.getFollowUpNotes());
        } catch (Exception e) {
            // Non-blocking fallback
        }

        // Send Status Update Email to Student
        try {
            emailSenderService.sendStudentStatusUpdateAlertAsync(updated, oldStatus, request.getFollowUpNotes());
        } catch (Exception e) {
            // Non-blocking fallback
        }

        // Record Status Update in Communication History (Student & Parent)
        try {
            String noteText = (request.getFollowUpNotes() != null && !request.getFollowUpNotes().isBlank())
                    ? "\nNotes: " + request.getFollowUpNotes() : "";

            // 1. Student Log
            communicationLogService.logCommunication(
                    updated.getReferenceNo(),
                    "STUDENT",
                    updated.getStudentName(),
                    updated.getEmail(),
                    "EMAIL",
                    "Admission Status Update: " + updated.getStatus() + " (Ref: " + updated.getReferenceNo() + ")",
                    "Admission status updated from " + oldStatus + " to " + updated.getStatus() + "." + noteText,
                    "SENT",
                    "STATUS_UPDATE",
                    null,
                    adminUsername != null ? adminUsername : "admin"
            );

            // 2. Parent Log
            String parentTarget = (updated.getParentEmail() != null && !updated.getParentEmail().isBlank())
                    ? updated.getParentEmail().trim()
                    : updated.getParentPhone();
            String parentChannel = (updated.getParentEmail() != null && !updated.getParentEmail().isBlank()) ? "EMAIL" : "SMS";

            communicationLogService.logCommunication(
                    updated.getReferenceNo(),
                    "PARENT",
                    updated.getParentName(),
                    parentTarget,
                    parentChannel,
                    "Admission Status Update - " + updated.getStatus(),
                    "Dear " + updated.getParentName() + ", status for " + updated.getStudentName() + " (" + updated.getReferenceNo() + ") is updated to " + updated.getStatus() + "." + noteText,
                    "SENT",
                    "STATUS_UPDATE",
                    null,
                    adminUsername != null ? adminUsername : "admin"
            );
        } catch (Exception e) {
            // Non-blocking fallback
        }

        return mapper.toDto(updated);
    }

    public String exportEnquiriesToCsv() {
        List<AdmissionEnquiry> list = enquiryRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        // CSV Header
        pw.println("Reference No,Student Name,Parent Name,Student Mobile,Parent Mobile,Parent Email,Email,Last Class,Board,Stream,Combination,Academic Year,Address,Pincode,Referred By,Status,Created At");

        for (AdmissionEnquiry e : list) {
            pw.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                    e.getReferenceNo(),
                    e.getStudentName(),
                    e.getParentName(),
                    e.getStudentPhone(),
                    e.getParentPhone(),
                    e.getParentEmail() != null ? e.getParentEmail() : "",
                    e.getEmail(),
                    e.getLastCompletedClass(),
                    e.getBoard(),
                    e.getPreferredStream(),
                    e.getPreferredCombination(),
                    e.getAcademicYear(),
                    e.getAddress() != null ? e.getAddress().replace("\"", "\"\"") : "",
                    e.getPincode() != null ? e.getPincode() : "",
                    e.getReferredBy() != null ? e.getReferredBy().replace("\"", "\"\"") : "",
                    e.getStatus(),
                    e.getCreatedAt() != null ? e.getCreatedAt().toString() : ""
            );
        }
        return sw.toString();
    }
}
