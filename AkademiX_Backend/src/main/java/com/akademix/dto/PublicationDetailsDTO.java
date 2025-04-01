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
public class PublicationDetailsDTO {
    private Long id;
    private String title;
    private String content;
    private String author;
    private Long authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer likes;
    private Integer comments;
} 