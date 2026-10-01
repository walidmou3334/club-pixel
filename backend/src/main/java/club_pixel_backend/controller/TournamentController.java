package club_pixel_backend.controller;

import club_pixel_backend.dto.TournamentRequest;
import club_pixel_backend.dto.TournamentResponse;
import club_pixel_backend.entity.Tournament;
import club_pixel_backend.service.TournamentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@org.springframework.transaction.annotation.Transactional
@RequestMapping("/api/tournaments")
public class TournamentController {

    private final TournamentService service;

    public TournamentController(TournamentService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TournamentResponse>> getPublished() {
        return ResponseEntity.ok(
                service.getPublished()
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    @PostMapping
    public ResponseEntity<TournamentResponse> create(
            @Valid @RequestBody TournamentRequest request
    ) {
        Tournament tournament = service.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(tournament));
    }

    private TournamentResponse toResponse(
            Tournament tournament
    ) {
        return new TournamentResponse(
                tournament.getId(),
                tournament.getTitle(),
                tournament.getGame().getId(),
                tournament.getGame().getName(),
                tournament.getStartDate(),
                tournament.getFormat(),
                tournament.getDescription(),
                tournament.getLocation(),
                tournament.getMaxTeams(),
                tournament.getRegistrationOpen(),
                tournament.getStatus().name()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TournamentResponse> getById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                toResponse(service.getPublishedById(id))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TournamentResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody TournamentRequest request
    ) {
        return ResponseEntity.ok(
                toResponse(service.update(id, request))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(
            @PathVariable Long id
    ) {
        service.cancel(id);

        return ResponseEntity.noContent().build();
    }
}