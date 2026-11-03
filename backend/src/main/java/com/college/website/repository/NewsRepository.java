package com.college.website.repository;

import com.college.website.entity.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    List<News> findByPublishedTrueOrderByPublishedAtDesc();
    Page<News> findByPublishedTrue(Pageable pageable);
    Optional<News> findBySlugAndPublishedTrue(String slug);
    Optional<News> findBySlug(String slug);
}
