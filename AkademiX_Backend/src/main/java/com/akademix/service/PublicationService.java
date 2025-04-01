package com.akademix.service;

import com.akademix.dto.PublicationDTO;
import com.akademix.dto.PublicationDetailsDTO;
import com.akademix.exception.ResourceNotFoundException;
import com.akademix.model.Publication;
import com.akademix.model.User;
import com.akademix.repository.PublicationRepository;
import com.akademix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublicationService {

    private final PublicationRepository publicationRepository;
    private final UserRepository userRepository;
    
    public Page<PublicationDTO> getAllPublications(Pageable pageable) {
        return publicationRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::convertToDTO);
    }
    
    public Page<PublicationDTO> getUserPublications(Long userId, Pageable pageable) {
        return publicationRepository.findByAuthorId(userId, pageable)
                .map(this::convertToDTO);
    }
    
    public PublicationDetailsDTO getPublicationDetails(Long id) {
        Publication publication = getPublicationById(id);
        
        Integer likesCount = publicationRepository.countLikesByPublicationId(id);
        Integer commentsCount = publicationRepository.countCommentsByPublicationId(id);
        
        return PublicationDetailsDTO.builder()
                .id(publication.getId())
                .title(publication.getTitle())
                .content(publication.getContent())
                .author(publication.getAuthor().getName())
                .authorId(publication.getAuthor().getId())
                .createdAt(publication.getCreatedAt())
                .updatedAt(publication.getUpdatedAt())
                .likes(likesCount)
                .comments(commentsCount)
                .build();
    }
    
    public List<PublicationDTO> searchPublications(String keyword) {
        return publicationRepository.searchPublications(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Publication getPublicationById(Long id) {
        return publicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publication not found with id: " + id));
    }
    
    @Transactional
    public PublicationDTO createPublication(String title, String content, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + authorId));
        
        Publication publication = new Publication();
        publication.setTitle(title);
        publication.setContent(content);
        publication.setAuthor(author);
        publication.setCreatedAt(LocalDateTime.now());
        
        Publication savedPublication = publicationRepository.save(publication);
        return convertToDTO(savedPublication);
    }
    
    @Transactional
    public PublicationDTO updatePublication(Long id, String title, String content) {
        Publication publication = getPublicationById(id);
        
        publication.setTitle(title);
        publication.setContent(content);
        publication.setUpdatedAt(LocalDateTime.now());
        
        Publication updatedPublication = publicationRepository.save(publication);
        return convertToDTO(updatedPublication);
    }
    
    @Transactional
    public void deletePublication(Long id) {
        Publication publication = getPublicationById(id);
        publicationRepository.delete(publication);
    }
    
    @Transactional
    public void likePublication(Long publicationId, Long userId) {
        Publication publication = getPublicationById(publicationId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        publication.getLikes().add(user);
        publicationRepository.save(publication);
    }
    
    @Transactional
    public void unlikePublication(Long publicationId, Long userId) {
        Publication publication = getPublicationById(publicationId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        publication.getLikes().remove(user);
        publicationRepository.save(publication);
    }
    
    private PublicationDTO convertToDTO(Publication publication) {
        return PublicationDTO.builder()
                .id(publication.getId())
                .title(publication.getTitle())
                .content(publication.getContent().substring(0, Math.min(publication.getContent().length(), 200)) + "...")
                .authorId(publication.getAuthor().getId())
                .authorName(publication.getAuthor().getName())
                .createdAt(publication.getCreatedAt())
                .likesCount(publication.getLikes().size())
                .commentsCount(publication.getComments().size())
                .build();
    }
} 