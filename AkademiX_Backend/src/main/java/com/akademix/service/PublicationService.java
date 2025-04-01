package com.akademix.service;

import com.akademix.model.Publication;
import com.akademix.model.User;
import com.akademix.repository.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PublicationService {
    
    @Autowired
    private PublicationRepository publicationRepository;

    public Publication createPublication(Publication publication) {
        return publicationRepository.save(publication);
    }

    public Optional<Publication> getPublicationById(Long id) {
        return publicationRepository.findById(id);
    }

    public List<Publication> getAllPublications() {
        return publicationRepository.findAll();
    }

    public List<Publication> getPublicationsByAuthor(User author) {
        return publicationRepository.findByAuthorOrderByCreatedAtDesc(author);
    }

    public Publication updatePublication(Publication publication) {
        return publicationRepository.save(publication);
    }

    public void deletePublication(Long id) {
        publicationRepository.deleteById(id);
    }

    public void likePublication(Publication publication, User user) {
        publication.getLikes().add(user);
        publicationRepository.save(publication);
    }

    public void unlikePublication(Publication publication, User user) {
        publication.getLikes().remove(user);
        publicationRepository.save(publication);
    }

    public void incrementViewCount(Publication publication) {
        publication.setViewCount(publication.getViewCount() + 1);
        publicationRepository.save(publication);
    }

    public List<Publication> searchPublications(String keyword) {
        return publicationRepository.findByTitleContainingOrSummaryContainingOrKeywordsContaining(
            keyword, keyword, keyword);
    }
} 