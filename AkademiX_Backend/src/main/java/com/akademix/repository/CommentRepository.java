package com.akademix.repository;

import com.akademix.model.Comment;
import com.akademix.model.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPublicationOrderByCreatedAtDesc(Publication publication);
} 