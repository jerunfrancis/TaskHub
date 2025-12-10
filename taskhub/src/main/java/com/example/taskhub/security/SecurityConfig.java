package com.example.taskhub.security;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    private final JwtAuthFilter jwt;
    public SecurityConfig(JwtAuthFilter jwt){ this.jwt = jwt; }

    @Bean PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(); }

    // TEMP: allow any origin/method/header, no credentials
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        var cfg = new CorsConfiguration();
        cfg.addAllowedOriginPattern("*");       // allow all origins
        cfg.addAllowedMethod("*");              // GET, POST, etc.
        cfg.addAllowedHeader("*");              // Authorization, Content-Type, etc.
        cfg.setAllowCredentials(false);         // keep false with wildcard origin
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    @Bean
    SecurityFilterChain filter(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable());
        http.cors(c -> {});
        http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        // TEMP: permit ALL to isolate the issue
        http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        // (jwt filter can stay; it won't block with permitAll)
        http.addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
