package club_pixel_backend.service;

import club_pixel_backend.dto.RegisterRequest;
import club_pixel_backend.entity.Role;
import club_pixel_backend.entity.User;
import club_pixel_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import club_pixel_backend.dto.LoginRequest;
import club_pixel_backend.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.MEMBER)
                .build();

        return userRepository.save(user);
    }

    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email or password incorrect"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()) || !user.isEnabled()) {
            throw new RuntimeException("Email or password incorrect");
        }

        return jwtService.generateToken(user);
    }
}