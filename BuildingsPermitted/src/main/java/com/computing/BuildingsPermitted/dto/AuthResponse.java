package com.computing.BuildingsPermitted.dto;

public class AuthResponse {
    
    private String token;
    private String email;
    private String username;
    private String role;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, String email, String username, String role, String message) {
        this.token = token;
        this.email = email;
        this.username = username;
        this.role = role;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
