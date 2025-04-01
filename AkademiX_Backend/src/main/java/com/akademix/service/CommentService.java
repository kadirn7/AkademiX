package com.akademix.service;

import com.akademix.dto.CommentDTO;
import com.akademix.exception.ResourceNotFoundException;
import com.akademix.model.Comment;
import com.akademix.model.Publication;
import com.akademix.model.User;
import com.akademix.repository.CommentRepository;
import com.akademix.repository.PublicationRepository;
import com.akademix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PublicationRepository publicationRepository;
    private final UserRepository userRepository;
    
    public Page<CommentDTO> getPublicationComments(Long publicationId, Pageable pageable) {
        return commentRepository.findByPublicationId(publicationId, pageable)
                .map(this::convertToDTO);
    }
    
    public Comment getCommentById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));
    }
    
    @Transactional
    public CommentDTO createComment(String content, Long publicationId, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + authorId));
        
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Publication not found with id: " + publicationId));
        
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setAuthor(author);
        comment.setPublication(publication);
        comment.setCreatedAt(LocalDateTime.now());
        
        Comment savedComment = commentRepository.save(comment);
        return convertToDTO(savedComment);
    }
    
    @Transactional
    public CommentDTO updateComment(Long id, String content) {
        Comment comment = getCommentById(id);
        
        comment.setContent(content);
        comment.setUpdatedAt(LocalDateTime.now());
        
        Comment updatedComment = commentRepository.save(comment);
        return convertToDTO(updatedComment);
    }
    
    @Transactional
    public void deleteComment(Long id) {
        Comment comment = getCommentById(id);
        commentRepository.delete(comment);
    }
    
    @Transactional
    public void likeComment(Long commentId, Long userId) {
        Comment comment = getCommentById(commentId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        comment.getLikes().add(user);
        commentRepository.save(comment);
    }
    
    @Transactional
    public void unlikeComment(Long commentId, Long userId) {
        Comment comment = getCommentById(commentId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        comment.getLikes().remove(user);
        commentRepository.save(comment);
    }
    
    private CommentDTO convertToDTO(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorId(comment.getAuthor().getId())
                .authorName(comment.getAuthor().getName())
                .publicationId(comment.getPublication().getId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .likesCount(comment.getLikes().size())
                .build();
    }
} 