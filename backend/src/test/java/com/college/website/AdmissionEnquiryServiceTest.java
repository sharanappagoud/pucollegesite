package com.college.website;

import com.college.website.dto.AdmissionEnquiryRequest;
import com.college.website.dto.AdmissionEnquiryResponse;
import com.college.website.dto.UpdateEnquiryStatusRequest;
import com.college.website.service.AdmissionEnquiryService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class AdmissionEnquiryServiceTest {

    @Autowired
    private AdmissionEnquiryService enquiryService;

    @Test
    void testCreateAdmissionEnquiryGeneratesRefNumber() {
        AdmissionEnquiryRequest req = new AdmissionEnquiryRequest();
        req.setStudentName("Manish Gowda");
        req.setParentName("Gowda K.");
        req.setStudentPhone("9845012399");
        req.setParentPhone("9845012398");
        req.setEmail("manish.g@example.com");
        req.setLastCompletedClass("10th Standard");
        req.setBoard("CBSE");
        req.setPreferredStream("SCIENCE");
        req.setPreferredCombination("PCMB");
        req.setMessage("Interested in medical preparation");

        AdmissionEnquiryResponse response = enquiryService.createEnquiry(req);

        Assertions.assertNotNull(response.getId());
        Assertions.assertNotNull(response.getReferenceNo());
        Assertions.assertTrue(response.getReferenceNo().startsWith("ADM-"));
        Assertions.assertEquals("NEW", response.getStatus());
        Assertions.assertEquals("Manish Gowda", response.getStudentName());
    }

    @Test
    void testUpdateEnquiryStatus() {
        AdmissionEnquiryRequest req = new AdmissionEnquiryRequest();
        req.setStudentName("Sneha Sharma");
        req.setParentName("Sharma S.");
        req.setStudentPhone("9845012388");
        req.setParentPhone("9845012387");
        req.setEmail("sneha.s@example.com");
        req.setLastCompletedClass("SSLC");
        req.setBoard("Karnataka Board");
        req.setPreferredStream("COMMERCE");
        req.setPreferredCombination("CEBA");

        AdmissionEnquiryResponse response = enquiryService.createEnquiry(req);

        UpdateEnquiryStatusRequest updateReq = new UpdateEnquiryStatusRequest();
        updateReq.setStatus("COUNSELLING_SCHEDULED");
        updateReq.setFollowUpNotes("Scheduled counselling interview on Monday");

        AdmissionEnquiryResponse updated = enquiryService.updateStatus(response.getId(), updateReq, "admin");

        Assertions.assertEquals("COUNSELLING_SCHEDULED", updated.getStatus());
        Assertions.assertTrue(updated.getFollowUpNotes().contains("Scheduled counselling interview"));
    }

    @Test
    void testExportCsv() {
        String csv = enquiryService.exportEnquiriesToCsv();
        Assertions.assertNotNull(csv);
        Assertions.assertTrue(csv.contains("Reference No,Student Name"));
    }
}
