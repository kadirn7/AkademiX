package com.akademix.repository;

import com.akademix.model.Publication;
import com.akademix.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
    List<Publication> findByAuthorOrderByCreatedAtDesc(User author);
    List<Publication> findByTitleContainingOrSummaryContainingOrKeywordsContaining(
        String title, String summary, String keyword);

    Page<Publication> findByAuthorId(Long authorId, Pageable pageable);
    
    @Query("SELECT p FROM Publication p ORDER BY p.createdAt DESC")
    Page<Publication> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT p FROM Publication p WHERE p.title LIKE %?1% OR p.content LIKE %?1%")
    List<Publication> searchPublications(String keyword);
    
    @Query("SELECT COUNT(l) FROM Publication p JOIN p.likes l WHERE p.id = ?1")
    Integer countLikesByPublicationId(Long publicationId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.publication.id = ?1")
    Integer countCommentsByPublicationId(Long publicationId);
    
    @Query(value = "SELECT p.* FROM publications p " +
                  "JOIN publication_likes l ON p.id = l.publication_id " +
                  "GROUP BY p.id " +
                  "ORDER BY COUNT(l.user_id) DESC", 
           nativeQuery = true)
    Page<Publication> findMostLikedPublications(Pageable pageable);
} 