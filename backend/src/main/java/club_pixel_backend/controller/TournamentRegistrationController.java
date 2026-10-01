package club_pixel_backend.controller;

import club_pixel_backend.entity.TournamentRegistration;
import club_pixel_backend.service.TournamentRegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentRegistrationController {

    private final TournamentRegistrationService service;

    public TournamentRegistrationController(
            TournamentRegistrationService service
    ) {
        this.service = service;
    }

    @PostMapping("/{tournamentId}/register")
    public ResponseEntity<?> register(
            @PathVariable Long tournamentId,
            Authentication authentication
    ) {
        TournamentRegistration registration =
                service.register(
                        tournamentId,
                        authentication.getName()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        Map.of(
                                "message",
                                "Tournament registration successful",
                                "registrationId",
                                registration.getId(),
                                "tournamentId",
                                tournamentId,
                                "email",
                                authentication.getName(),
                                "status",
                                registration.getStatus()
                        )
                );
    }

    @DeleteMapping("/{tournamentId}/register")
    public ResponseEntity<Void> cancelRegistration(
            @PathVariable Long tournamentId,
            Authentication authentication
    ) {
        service.cancelRegistration(
                tournamentId,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }
}