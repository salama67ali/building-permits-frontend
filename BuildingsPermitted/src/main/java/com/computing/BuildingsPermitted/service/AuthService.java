package com.computing.BuildingsPermitted.service;

import com.computing.BuildingsPermitted.dto.AuthRequest;
import com.computing.BuildingsPermitted.dto.AuthResponse;
import com.computing.BuildingsPermitted.dto.UserRegistrationRequest;
import com.computing.BuildingsPermitted.model.User;
import com.computing.BuildingsPermitted.repository.UserRepository;
import com.computing.BuildingsPermitted.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse register(UserRegistrationRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }

        // Create new user
        User user = new User(
            request.getUsername(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            request.getRole()
        );

        userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getEmail(), user.getUsername(), user.getRole(), "User registered successfully");
    }

    public AuthResponse login(AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            return new AuthResponse(token, user.getEmail(), user.getUsername(), user.getRole(), "Login successful");
        } catch (Exception e) {
            throw new RuntimeException("Invalid email or password");
        }
    }


}
