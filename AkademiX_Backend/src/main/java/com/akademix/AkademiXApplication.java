package com.akademix;

import com.akademix.config.JwtConfig;
import com.akademix.model.Role;
import com.akademix.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableConfigurationProperties({JwtConfig.class})
public class AkademiXApplication {

    public static void main(String[] args) {
        SpringApplication.run(AkademiXApplication.class, args);
    }
    
    @Bean
    public CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            // Başlangıçta rol tablosunu doldur
            if (roleRepository.count() == 0) {
                roleRepository.save(new Role(null, Role.ERole.ROLE_USER));
                roleRepository.save(new Role(null, Role.ERole.ROLE_MODERATOR));
                roleRepository.save(new Role(null, Role.ERole.ROLE_ADMIN));
            }
        };
    }
} 