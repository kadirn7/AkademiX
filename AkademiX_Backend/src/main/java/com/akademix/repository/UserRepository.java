package com.akademix.repository;

import com.akademix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.name LIKE %?1% OR u.email LIKE %?1%")
    List<User> searchUsers(String keyword);
    
    @Query("SELECT COUNT(p) FROM Publication p WHERE p.author.id = ?1")
    Integer countPublicationsByUserId(Long userId);
    
    @Query("SELECT COUNT(f) FROM User u JOIN u.followers f WHERE u.id = ?1")
    Integer countFollowersByUserId(Long userId);
    
    @Query("SELECT COUNT(f) FROM User u JOIN u.following f WHERE u.id = ?1")
    Integer countFollowingByUserId(Long userId);
} 