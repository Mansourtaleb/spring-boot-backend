package com.example.authapp.controllers;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.authapp.models.User;
import com.example.authapp.payload.request.UpdateUserRequest;
import com.example.authapp.payload.response.MessageResponse;
import com.example.authapp.payload.response.UserResponse;
import com.example.authapp.repository.UserRepository;
import com.example.authapp.security.services.UserDetailsImpl;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;
    
    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Error: User not found."));
        
        List<String> roles = user.getRoles().stream()
            .map(role -> role.getName().name())
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(new UserResponse(
            user.getId(), 
            user.getUsername(), 
            user.getEmail(), 
            roles
        ));
    }
    
    @PutMapping("/user")
    public ResponseEntity<?> updateUserDetails(@Valid @RequestBody UpdateUserRequest updateRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Error: User not found."));
        
        // Validate current password if changing password
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
            if (updateRequest.getCurrentPassword() == null || updateRequest.getCurrentPassword().isEmpty()) {
                return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Current password is required to set a new password."));
            }
            
            if (!encoder.matches(updateRequest.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Current password is incorrect."));
            }
            
            user.setPassword(encoder.encode(updateRequest.getPassword()));
        }
        
        // Update username if provided and not taken
        if (updateRequest.getUsername() != null && !updateRequest.getUsername().isEmpty() 
                && !updateRequest.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(updateRequest.getUsername())) {
                return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
            }
            user.setUsername(updateRequest.getUsername());
        }
        
        // Update email if provided and not taken
        if (updateRequest.getEmail() != null && !updateRequest.getEmail().isEmpty() 
                && !updateRequest.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(updateRequest.getEmail())) {
                return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
            }
            user.setEmail(updateRequest.getEmail());
        }
        
        userRepository.save(user);
        
        List<String> roles = user.getRoles().stream()
            .map(role -> role.getName().name())
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(new UserResponse(
            user.getId(), 
            user.getUsername(), 
            user.getEmail(), 
            roles
        ));
    }
}