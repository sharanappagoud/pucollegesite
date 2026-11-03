package com.college.website.repository;

import com.college.website.entity.GalleryCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GalleryCategoryRepository extends JpaRepository<GalleryCategory, Long> {
    Optional<GalleryCategory> findBySlug(String slug);
}
