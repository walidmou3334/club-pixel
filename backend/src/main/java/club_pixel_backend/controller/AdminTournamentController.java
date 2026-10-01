package club_pixel_backend.controller;

import club_pixel_backend.dto.AdminTournamentRegistrationResponse;
import club_pixel_backend.repository.TournamentRegistrationRepository;
import club_pixel_backend.repository.TournamentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@org.springframework.transaction.annotation.Transactional(readOnly=true)
@RequestMapping("/api/admin/tournaments")
public class AdminTournamentController {

    private final TournamentRepository tournamentRepository;
    private final TournamentRegistrationRepository registrationRepository;

    public AdminTournamentController(
            TournamentRepository tournamentRepository,
            TournamentRegistrationRepository registrationRepository
    ) {
        this.tournamentRepository = tournamentRepository;
        this.registrationRepository = registrationRepository;
    }

    @GetMapping("/{tournamentId}/registrations")
    public ResponseEntity<?> getRegistrations(
            @PathVariable Long tournamentId
    ) {
        if (!tournamentRepository.existsById(tournamentId)) {
            return ResponseEntity.notFound().build();
        }

        var response = registrationRepository
                .findByTournamentId(tournamentId)
                .stream()
                .map(registration ->
                        new AdminTournamentRegistrationResponse(
                                registration.getId(),
                                registration.getUser().getId(),
                                registration.getUser().getName(),
                                registration.getUser().getEmail(),
                                registration.getStatus().name(),
                                registration.getRegisteredAt()
                        )
                )
                .toList();

        return ResponseEntity.ok(response);
    }
}