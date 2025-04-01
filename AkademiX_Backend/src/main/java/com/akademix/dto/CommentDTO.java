package com.akademix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private String content;
    private Long authorId;
    private String authorName;
    private Long publicationId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer likesCount;
} 