package com.akademix.controller;

import com.akademix.dto.PublicationDTO;
import com.akademix.dto.PublicationDetailsDTO;
import com.akademix.security.UserDetailsImpl;
import com.akademix.service.PublicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/publications")
@RequiredArgsConstructor
public class PublicationController {

    private final PublicationService publicationService;

    @GetMapping
    public ResponseEntity<Page<PublicationDTO>> getAllPublications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(publicationService.getAllPublications(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicationDetailsDTO> getPublicationDetails(@PathVariable Long id) {
        return ResponseEntity.ok(publicationService.getPublicationDetails(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PublicationDTO>> getUserPublications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(publicationService.getUserPublications(userId, pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PublicationDTO>> searchPublications(@RequestParam String keyword) {
        return ResponseEntity.ok(publicationService.searchPublications(keyword));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PublicationDTO> createPublication(@Valid @RequestBody CreatePublicationRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        PublicationDTO publication = publicationService.createPublication(
                request.getTitle(), request.getContent(), userDetails.getId());

        return ResponseEntity.ok(publication);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PublicationDTO> updatePublication(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePublicationRequest request) {
        PublicationDTO publication = publicationService.updatePublication(
                id, request.getTitle(), request.getContent());

        return ResponseEntity.ok(publication);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deletePublication(@PathVariable Long id) {
        publicationService.deletePublication(id);
        return ResponseEntity.ok("Publication deleted successfully");
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> likePublication(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        publicationService.likePublication(id, userDetails.getId());
        return ResponseEntity.ok("Publication liked successfully");
    }

    @PostMapping("/{id}/unlike")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> unlikePublication(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        publicationService.unlikePublication(id, userDetails.getId());
        return ResponseEntity.ok("Publication unliked successfully");
    }

    // Request DTOs
    public static class CreatePublicationRequest {
        private String title;
        private String content;

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }

    public static class UpdatePublicationRequest {
        private String title;
        private String content;

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
} 