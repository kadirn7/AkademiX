package com.akademix.service;

import com.akademix.model.User;
import com.akademix.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
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

    public void followUser(User follower, User following) {
        following.getFollowers().add(follower);
        userRepository.save(following);
    }

    public void unfollowUser(User follower, User following) {
        following.getFollowers().remove(follower);
        userRepository.save(following);
    }

    public List<User> getFollowers(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getFollowers().stream().toList())
                .orElse(List.of());
    }

    public List<User> getFollowing(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getFollowing().stream().toList())
                .orElse(List.of());
    }
} 