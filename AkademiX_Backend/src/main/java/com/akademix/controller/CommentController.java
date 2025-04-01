package com.akademix.controller;

import com.akademix.dto.CommentDTO;
import com.akademix.security.UserDetailsImpl;
import com.akademix.service.CommentService;
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

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/publication/{publicationId}")
    public ResponseEntity<Page<CommentDTO>> getPublicationComments(
            @PathVariable Long publicationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(commentService.getPublicationComments(publicationId, pageable));
    }

    @PostMapping("/publication/{publicationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable Long publicationId,
            @Valid @RequestBody CreateCommentRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        CommentDTO comment = commentService.createComment(
                request.getContent(), publicationId, userDetails.getId());

        return ResponseEntity.ok(comment);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCommentRequest request) {
        CommentDTO comment = commentService.updateComment(id, request.getContent());
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok("Comment deleted successfully");
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> likeComment(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        commentService.likeComment(id, userDetails.getId());
        return ResponseEntity.ok("Comment liked successfully");
    }

    @PostMapping("/{id}/unlike")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> unlikeComment(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        commentService.unlikeComment(id, userDetails.getId());
        return ResponseEntity.ok("Comment unliked successfully");
    }

    // Request DTOs
    public static class CreateCommentRequest {
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }

    public static class UpdateCommentRequest {
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
} 