package club_pixel_backend.controller;

import club_pixel_backend.dto.UpdateSuggestionStatusRequest;
import club_pixel_backend.entity.Suggestion;
import club_pixel_backend.service.SuggestionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/suggestions")
public class AdminSuggestionController {

    private final SuggestionService service;

    public AdminSuggestionController(
            SuggestionService service
    ) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSuggestionStatusRequest request
    ) {
        Suggestion suggestion = service.updateStatus(
                id,
                request.getStatus()
        );

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message", "Suggestion status updated",
                        "id", suggestion.getId(),
                        "status", suggestion.getStatus()
                )
        );
    }
}