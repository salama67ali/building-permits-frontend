package com.computing.BuildingsPermitted.config;

import com.computing.BuildingsPermitted.model.User;
import com.computing.BuildingsPermitted.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@manage.com".trim().toLowerCase();

            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setUsername("Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole("admin");

                userRepository.save(admin);
                System.out.println("✅ Default admin account created: " + adminEmail);
            } else {
                System.out.println("ℹ️ Admin account already exists. Skipping creation.");
            }
        };
    }
}
