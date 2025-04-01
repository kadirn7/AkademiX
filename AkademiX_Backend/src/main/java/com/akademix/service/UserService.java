package com.akademix.service;

import com.akademix.dto.UserProfileDTO;
import com.akademix.dto.UserSummaryDTO;
import com.akademix.exception.ResourceNotFoundException;
import com.akademix.model.User;
import com.akademix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public UserProfileDTO getUserProfile(Long id) {
        User user = getUserById(id);
        
        Integer publicationsCount = userRepository.countPublicationsByUserId(id);
        Integer followersCount = userRepository.countFollowersByUserId(id);
        Integer followingCount = userRepository.countFollowingByUserId(id);
        
        return UserProfileDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .title(user.getTitle())
                .institution(user.getInstitution())
                .bio(user.getBio())
                .profileImage(user.getProfileImage())
                .publications(publicationsCount)
                .followers(followersCount)
                .following(followingCount)
                .createdAt(user.getCreatedAt())
                .build();
    }
    
    public List<UserSummaryDTO> searchUsers(String keyword) {
        return userRepository.searchUsers(keyword).stream()
                .map(user -> UserSummaryDTO.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .title(user.getTitle())
                        .institution(user.getInstitution())
                        .profileImage(user.getProfileImage())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void followUser(Long userId, Long targetUserId) {
        if (userId.equals(targetUserId)) {
            throw new IllegalArgumentException("User cannot follow themselves");
        }
        
        User user = getUserById(userId);
        User targetUser = getUserById(targetUserId);
        
        targetUser.getFollowers().add(user);
        userRepository.save(targetUser);
    }

    @Transactional
    public void unfollowUser(Long userId, Long targetUserId) {
        User user = getUserById(userId);
        User targetUser = getUserById(targetUserId);
        
        targetUser.getFollowers().remove(user);
        userRepository.save(targetUser);
    }

    public List<User> getFollowers(Long userId) {
        User user = getUserById(userId);
        return user.getFollowers().stream().collect(Collectors.toList());
    }

    public List<User> getFollowing(Long userId) {
        User user = getUserById(userId);
        return user.getFollowing().stream().collect(Collectors.toList());
    }
} 