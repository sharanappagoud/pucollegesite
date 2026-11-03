package com.college.website.repository;

import com.college.website.entity.GalleryImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {
    @Query("SELECT g FROM GalleryImage g WHERE g.category.id = :categoryId ORDER BY g.displayOrder ASC")
    List<GalleryImage> findByCategoryIdOrderByDisplayOrderAsc(@Param("categoryId") Long categoryId);

    List<GalleryImage> findAllByOrderByDisplayOrderAsc();
}
