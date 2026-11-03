package com.college.website.controller;

import com.college.website.dto.AdmissionEnquiryRequest;
import com.college.website.dto.AdmissionEnquiryResponse;
import com.college.website.dto.ApiResponse;
import com.college.website.dto.ContactEnquiryRequest;
import com.college.website.entity.ContactEnquiry;
import com.college.website.service.AdmissionEnquiryService;
import com.college.website.service.ContactEnquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Public Enquiry APIs", description = "Student Admission Enquiries and Contact Submissions")
public class PublicEnquiryController {

    private final AdmissionEnquiryService admissionEnquiryService;
    private final ContactEnquiryService contactEnquiryService;

    public PublicEnquiryController(AdmissionEnquiryService admissionEnquiryService,
                                   ContactEnquiryService contactEnquiryService) {
        this.admissionEnquiryService = admissionEnquiryService;
        this.contactEnquiryService = contactEnquiryService;
    }

    @PostMapping("/admission-enquiries")
    @Operation(summary = "Submit a new admission enquiry")
    public ResponseEntity<ApiResponse<AdmissionEnquiryResponse>> submitAdmissionEnquiry(
            @Valid @RequestBody AdmissionEnquiryRequest request) {
        AdmissionEnquiryResponse response = admissionEnquiryService.createEnquiry(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Admission enquiry submitted successfully. Your reference number is " + response.getReferenceNo(), response));
    }

    @GetMapping("/admission-enquiries/track/{referenceNo}")
    @Operation(summary = "Track enquiry status by unique reference number")
    public ResponseEntity<ApiResponse<AdmissionEnquiryResponse>> trackEnquiry(
            @PathVariable String referenceNo) {
        AdmissionEnquiryResponse response = admissionEnquiryService.getEnquiryByReference(referenceNo);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/contact-enquiries")
    @Operation(summary = "Submit general contact enquiry")
    public ResponseEntity<ApiResponse<ContactEnquiry>> submitContactEnquiry(
            @Valid @RequestBody ContactEnquiryRequest request) {
        ContactEnquiry response = contactEnquiryService.createEnquiry(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Thank you! Your message has been received. Our team will contact you shortly.", response));
    }
}
