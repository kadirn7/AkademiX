package com.akademix.repository;

import com.akademix.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByPublicationId(Long publicationId, Pageable pageable);
    
    Page<Comment> findByAuthorId(Long authorId, Pageable pageable);
    
    @Query("SELECT COUNT(l) FROM Comment c JOIN c.likes l WHERE c.id = ?1")
    Integer countLikesByCommentId(Long commentId);
} 