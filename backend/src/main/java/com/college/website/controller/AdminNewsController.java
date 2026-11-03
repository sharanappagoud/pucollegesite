package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.dto.NewsDto;
import com.college.website.service.NewsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/news")
@Tag(name = "Admin News Management", description = "CRUD for college news & announcements")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminNewsController {

    private final NewsService newsService;

    public AdminNewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    @Operation(summary = "Get all news articles for admin")
    public ResponseEntity<ApiResponse<List<NewsDto>>> getAllNews() {
        return ResponseEntity.ok(ApiResponse.ok(newsService.getAllNewsAdmin()));
    }

    @PostMapping
    @Operation(summary = "Create or update news article")
    public ResponseEntity<ApiResponse<NewsDto>> saveNews(
            @Valid @RequestBody NewsDto newsDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        NewsDto saved = newsService.saveNews(newsDto, username);
        return ResponseEntity.ok(ApiResponse.ok("News article saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete news article")
    public ResponseEntity<ApiResponse<Void>> deleteNews(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        newsService.deleteNews(id, username);
        return ResponseEntity.ok(ApiResponse.ok("News article deleted successfully", null));
    }
}
