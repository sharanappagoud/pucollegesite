package com.college.website.service;

import com.college.website.dto.ContactEnquiryRequest;
import com.college.website.entity.ContactEnquiry;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.repository.ContactEnquiryRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContactEnquiryService {

    private final ContactEnquiryRepository contactEnquiryRepository;
    private final AuditLogService auditLogService;

    public ContactEnquiryService(ContactEnquiryRepository contactEnquiryRepository,
                                 AuditLogService auditLogService) {
        this.contactEnquiryRepository = contactEnquiryRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public ContactEnquiry createEnquiry(ContactEnquiryRequest request) {
        ContactEnquiry ce = new ContactEnquiry();
        ce.setFullName(request.getFullName());
        ce.setEmail(request.getEmail());
        ce.setPhone(request.getPhone());
        ce.setSubject(request.getSubject());
        ce.setMessage(request.getMessage());
        ce.setStatus("NEW");

        ContactEnquiry saved = contactEnquiryRepository.save(ce);
        auditLogService.logAction("VISITOR", "SUBMIT_CONTACT_FORM", "CONTACT", "Subject: " + ce.getSubject());
        return saved;
    }

    public List<ContactEnquiry> getAllEnquiries(String status) {
        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            return contactEnquiryRepository.findByStatus(status.toUpperCase());
        }
        return contactEnquiryRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Transactional
    public ContactEnquiry updateStatus(Long id, String status, String notes, String adminUsername) {
        ContactEnquiry ce = contactEnquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact Enquiry", "id", id));
        ce.setStatus(status.toUpperCase());
        if (notes != null) {
            ce.setResponseNotes(notes);
        }
        ContactEnquiry saved = contactEnquiryRepository.save(ce);
        auditLogService.logAction(adminUsername, "UPDATE_CONTACT_STATUS", "CONTACT", "Updated id " + id + " to " + status);
        return saved;
    }
}
