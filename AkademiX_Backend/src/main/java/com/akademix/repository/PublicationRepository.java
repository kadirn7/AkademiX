package com.akademix.repository;

import com.akademix.model.Publication;
import com.akademix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
    List<Publication> findByAuthorOrderByCreatedAtDesc(User author);
    List<Publication> findByTitleContainingOrSummaryContainingOrKeywordsContaining(
        String title, String summary, String keyword);
} 