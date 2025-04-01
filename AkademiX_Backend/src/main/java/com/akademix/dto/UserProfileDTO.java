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
public class UserProfileDTO {
    private Long id;
    private String name;
    private String email;
    private String title;
    private String institution;
    private String bio;
    private String profileImage;
    private Integer publications;
    private Integer followers;
    private Integer following;
    private LocalDateTime createdAt;
} 