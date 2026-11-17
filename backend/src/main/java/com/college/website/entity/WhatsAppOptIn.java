package com.college.website.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "whatsapp_opt_in_records")
public class WhatsAppOptIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_number", nullable = false, unique = true, length = 30)
    private String phoneNumber;

    @Column(name = "student_name", length = 150)
    private String studentName;

    @Column(name = "opt_in_source", length = 100)
    private String optInSource = "ADMISSION_ENQUIRY";

    @Column(name = "is_opted_in")
    private Boolean isOptedIn = true;

    @Column(name = "opt_in_date")
    private LocalDateTime optInDate = LocalDateTime.now();

    @Column(name = "opt_out_date")
    private LocalDateTime optOutDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public WhatsAppOptIn() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getOptInSource() { return optInSource; }
    public void setOptInSource(String optInSource) { this.optInSource = optInSource; }

    public Boolean getIsOptedIn() { return isOptedIn; }
    public void setIsOptedIn(Boolean isOptedIn) { this.isOptedIn = isOptedIn; }

    public LocalDateTime getOptInDate() { return optInDate; }
    public void setOptInDate(LocalDateTime optInDate) { this.optInDate = optInDate; }

    public LocalDateTime getOptOutDate() { return optOutDate; }
    public void setOptOutDate(LocalDateTime optOutDate) { this.optOutDate = optOutDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
