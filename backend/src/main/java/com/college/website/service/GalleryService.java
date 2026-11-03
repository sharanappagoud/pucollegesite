package com.college.website.service;

import com.college.website.entity.GalleryCategory;
import com.college.website.entity.GalleryImage;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.repository.GalleryCategoryRepository;
import com.college.website.repository.GalleryImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class GalleryService {

    private final GalleryCategoryRepository categoryRepository;
    private final GalleryImageRepository imageRepository;
    private final AuditLogService auditLogService;

    public GalleryService(GalleryCategoryRepository categoryRepository,
                          GalleryImageRepository imageRepository,
                          AuditLogService auditLogService) {
        this.categoryRepository = categoryRepository;
        this.imageRepository = imageRepository;
        this.auditLogService = auditLogService;
    }

    public List<GalleryCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<GalleryImage> getImagesByCategory(Long categoryId) {
        if (categoryId != null && categoryId > 0) {
            return imageRepository.findByCategoryIdOrderByDisplayOrderAsc(categoryId);
        }
        return imageRepository.findAllByOrderByDisplayOrderAsc();
    }

    @Transactional
    public GalleryImage saveImage(Long categoryId, String title, String description, String imageUrl, Integer displayOrder, String adminUsername) {
        GalleryImage img = new GalleryImage();
        if (categoryId != null) {
            GalleryCategory category = categoryRepository.findById(categoryId)
                    .orElse(null);
            img.setCategory(category);
        }
        img.setTitle(title);
        img.setDescription(description);
        img.setImageUrl(imageUrl);
        img.setDisplayOrder(displayOrder != null ? displayOrder : 0);

        GalleryImage saved = imageRepository.save(img);
        auditLogService.logAction(adminUsername, "ADD_GALLERY_IMAGE", "GALLERY", "Title: " + title);
        return saved;
    }

    @Transactional
    public void deleteImage(Long id, String adminUsername) {
        GalleryImage img = imageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery Image", "id", id));
        imageRepository.delete(img);
        auditLogService.logAction(adminUsername, "DELETE_GALLERY_IMAGE", "GALLERY", "ID: " + id);
    }
}
