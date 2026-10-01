package club_pixel_backend.controller;

import club_pixel_backend.dto.ProfileResponse;
import club_pixel_backend.dto.ProfileUpdateRequest;
import club_pixel_backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class ProfileController {

    private final ProfileService service;

    public ProfileController(ProfileService service) {
        this.service = service;
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getProfile(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                service.getProfile(authentication.getName())
        );
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request
    ) {
        return ResponseEntity.ok(
                service.updateProfile(
                        authentication.getName(),
                        request
                )
        );
    }
}