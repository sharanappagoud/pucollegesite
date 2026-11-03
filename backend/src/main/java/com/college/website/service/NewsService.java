package com.college.website.service;

import com.college.website.dto.NewsDto;
import com.college.website.entity.News;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.mapper.EntityDtoMapper;
import com.college.website.repository.NewsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsService {

    private final NewsRepository newsRepository;
    private final EntityDtoMapper mapper;
    private final AuditLogService auditLogService;

    public NewsService(NewsRepository newsRepository,
                       EntityDtoMapper mapper,
                       AuditLogService auditLogService) {
        this.newsRepository = newsRepository;
        this.mapper = mapper;
        this.auditLogService = auditLogService;
    }

    public List<NewsDto> getPublicNews() {
        return newsRepository.findByPublishedTrueOrderByPublishedAtDesc().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public NewsDto getNewsBySlug(String slug) {
        News news = newsRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("News", "slug", slug));
        return mapper.toDto(news);
    }

    public List<NewsDto> getAllNewsAdmin() {
        return newsRepository.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public NewsDto getNewsById(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News", "id", id));
        return mapper.toDto(news);
    }

    @Transactional
    public NewsDto saveNews(NewsDto dto, String adminUsername) {
        News news;
        boolean isNew = (dto.getId() == null);
        if (!isNew) {
            news = newsRepository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("News", "id", dto.getId()));
        } else {
            news = new News();
        }

        news.setTitle(dto.getTitle());
        if (dto.getSlug() == null || dto.getSlug().trim().isEmpty()) {
            news.setSlug(dto.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        } else {
            news.setSlug(dto.getSlug());
        }
        news.setExcerpt(dto.getExcerpt());
        news.setContent(dto.getContent());
        news.setCategory(dto.getCategory() != null ? dto.getCategory() : "General");
        news.setImageUrl(dto.getImageUrl());
        news.setPublishedAt(dto.getPublishedAt() != null ? dto.getPublishedAt() : LocalDate.now());
        news.setPublished(dto.getPublished() != null ? dto.getPublished() : true);

        News saved = newsRepository.save(news);
        auditLogService.logAction(adminUsername, isNew ? "CREATE_NEWS" : "UPDATE_NEWS", "NEWS", "Title: " + saved.getTitle());
        return mapper.toDto(saved);
    }

    @Transactional
    public void deleteNews(Long id, String adminUsername) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News", "id", id));
        newsRepository.delete(news);
        auditLogService.logAction(adminUsername, "DELETE_NEWS", "NEWS", "Deleted news ID: " + id);
    }
}
