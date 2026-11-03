package com.college.website.repository;

import com.college.website.entity.PageContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PageContentRepository extends JpaRepository<PageContent, Long> {
    Optional<PageContent> findBySlug(String slug);
    Optional<PageContent> findBySlugAndPublishedTrue(String slug);
}
