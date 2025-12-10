package com.example.taskhub.api;

import com.example.taskhub.dto.*;
import com.example.taskhub.security.JwtService;
import com.example.taskhub.user.UserEntity;
import com.example.taskhub.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder enc;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder enc, JwtService jwt){
        this.users = users; this.enc = enc; this.jwt = jwt;
    }

    @PostMapping("/signup")
    public TokenResponse signup(@RequestBody SignupRequest r){
        if (users.existsByUsername(r.username()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username taken");
        var u = new UserEntity();
        u.setUsername(r.username());
        u.setPassword(enc.encode(r.password()));
        if (r.role()!=null) u.setRole(UserEntity.Role.valueOf(r.role().toUpperCase()));
        users.save(u);
        var token = jwt.generate(u.getUsername(), u.getRole().name());
        return new TokenResponse(token, u.getUsername(), u.getRole().name());
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody LoginRequest r){
        var u = users.findByUsername(r.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bad credentials"));
        if (!enc.matches(r.password(), u.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bad credentials");
        var token = jwt.generate(u.getUsername(), u.getRole().name());
        return new TokenResponse(token, u.getUsername(), u.getRole().name());
    }
}
