package com.college.website.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "banners")
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 255)
    private String subtitle;

    @Column(name = "cta_text", length = 100)
    private String ctaText;

    @Column(name = "cta_link", length = 255)
    private String ctaLink;

    @Column(name = "title_color", length = 30)
    private String titleColor = "#FFFFFF";

    @Column(name = "highlight_text", length = 255)
    private String highlightText;

    @Column(name = "highlight_color", length = 30)
    private String highlightColor = "#E6CA65";

    @Column(name = "subtitle_color", length = 30)
    private String subtitleColor = "#CBD5E1";

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Banner() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getCtaText() { return ctaText; }
    public void setCtaText(String ctaText) { this.ctaText = ctaText; }
    public String getCtaLink() { return ctaLink; }
    public void setCtaLink(String ctaLink) { this.ctaLink = ctaLink; }
    public String getTitleColor() { return titleColor; }
    public void setTitleColor(String titleColor) { this.titleColor = titleColor; }
    public String getHighlightText() { return highlightText; }
    public void setHighlightText(String highlightText) { this.highlightText = highlightText; }
    public String getHighlightColor() { return highlightColor; }
    public void setHighlightColor(String highlightColor) { this.highlightColor = highlightColor; }
    public String getSubtitleColor() { return subtitleColor; }
    public void setSubtitleColor(String subtitleColor) { this.subtitleColor = subtitleColor; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
