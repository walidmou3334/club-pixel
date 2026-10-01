package club_pixel_backend.controller;

import club_pixel_backend.dto.SuggestionRequest;
import club_pixel_backend.entity.Suggestion;
import club_pixel_backend.service.SuggestionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/suggestions")
public class SuggestionController {

    private final SuggestionService service;
    private final club_pixel_backend.repository.UserRepository users;

    public SuggestionController(
            SuggestionService service, club_pixel_backend.repository.UserRepository users
    ) {
        this.service = service; this.users=users;
    }

    @PostMapping
    public ResponseEntity<?> create(
            @Valid @RequestBody SuggestionRequest request, org.springframework.security.core.Authentication authentication
    ) {
        Long authorId = authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)
                ? users.findByEmail(authentication.getName()).orElseThrow().getId() : null;
        Suggestion suggestion = service.create(request, authorId);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                        "message", "Suggestion submitted successfully",
                        "id", suggestion.getId(),
                        "status", suggestion.getStatus()
                )
        );
    }
}