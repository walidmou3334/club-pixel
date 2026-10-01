package club_pixel_backend.controller;

import club_pixel_backend.dto.GameRequest;
import club_pixel_backend.entity.Game;
import club_pixel_backend.service.GameService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService service;

    public GameController(GameService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Game>> getActiveGames() {
        return ResponseEntity.ok(service.getActiveGames());
    }

    @PostMapping
    public ResponseEntity<Game> create(
            @Valid @RequestBody GameRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Game> update(
            @PathVariable Long id,
            @Valid @RequestBody GameRequest request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(
            @PathVariable Long id
    ) {
        service.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}