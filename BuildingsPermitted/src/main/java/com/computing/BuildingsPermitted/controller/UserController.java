package com.computing.BuildingsPermitted.controller;

import com.computing.BuildingsPermitted.dto.AuthRequest;
import com.computing.BuildingsPermitted.dto.AuthResponse;
import com.computing.BuildingsPermitted.dto.UserRegistrationRequest;
import com.computing.BuildingsPermitted.model.User;
import com.computing.BuildingsPermitted.repository.UserRepository;
import com.computing.BuildingsPermitted.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    // JWT Authentication endpoints
    @PostMapping("/auth/register")
    public ResponseEntity<AuthResponse> registerWithJwt(@Valid @RequestBody UserRegistrationRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, null, e.getMessage()));
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> loginWithJwt(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, null, e.getMessage()));
        }
    }

    // Legacy registration endpoint (keeping for backward compatibility)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        String email = user.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered."));
        }
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Registration successful."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody User request) {
        String email = request.getEmail().trim().toLowerCase();
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            return ResponseEntity.ok(Map.of("message", "Password reset instructions sent."));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Email not found."));
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/users")
    public ResponseEntity<?> addUser(@RequestBody User user) {
        String email = user.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists."));
        }
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User added successfully."));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setUsername(updatedUser.getUsername());
                    user.setRole(updatedUser.getRole());
                    if (updatedUser.getEmail() != null) {
                        user.setEmail(updatedUser.getEmail().trim().toLowerCase());
                    }
                    if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                        user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                    }
                    userRepository.save(user);
                    return ResponseEntity.ok(Map.of("message", "User updated successfully."));
                })
                .orElse(ResponseEntity.notFound().build());
    }



    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found."));
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully."));
    }

    // Role-based dashboard endpoints
    @GetMapping("/owner/dashboard")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<String> getOwnerDashboard() {
        return ResponseEntity.ok("Owner Dashboard - Welcome to your building permit management system!");
    }

    @GetMapping("/consultant/dashboard")
    @PreAuthorize("hasAnyRole('CONSULTANT', 'ADMIN')")
    public ResponseEntity<String> getConsultantDashboard() {
        return ResponseEntity.ok("Consultant Dashboard - Manage your building permit consultations!");
    }

    @GetMapping("/engineer/dashboard")
    @PreAuthorize("hasAnyRole('ENGINEER', 'ADMIN')")
    public ResponseEntity<String> getEngineerDashboard() {
        return ResponseEntity.ok("Engineer Dashboard - Review and approve building permits!");
    }

    @GetMapping("/government-board/dashboard")
    @PreAuthorize("hasAnyRole('GOVERNMENT_BOARD', 'ADMIN')")
    public ResponseEntity<String> getGovernmentBoardDashboard() {
        return ResponseEntity.ok("Government Board Dashboard - Oversee building permit regulations!");
    }
}
