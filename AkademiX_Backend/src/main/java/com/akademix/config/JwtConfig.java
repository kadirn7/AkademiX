package com.akademix.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * JWT yapılandırmasını yönetmek için kullanılan sınıf.
 * application.yml veya application.properties dosyasındaki app.jwt.* özelliklerini eşler.
 * 
 * Örneğin:
 * app.jwt.secret=secret_key
 * app.jwt.expiration=86400000
 */
@Data
@ConfigurationProperties(prefix = "app.jwt")
public class JwtConfig {
    
    /**
     * JWT imzalamak için kullanılan gizli anahtar.
     */
    private String secret;
    
    /**
     * JWT token'ın geçerlilik süresi (milisaniye cinsinden).
     * Varsayılan değer: 1 gün (86.400.000 ms)
     */
    private long expiration = 86400000L;
} 