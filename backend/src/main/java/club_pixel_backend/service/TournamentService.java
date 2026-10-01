package club_pixel_backend.service;

import club_pixel_backend.dto.TournamentRequest;
import club_pixel_backend.entity.*;
import club_pixel_backend.repository.GameRepository;
import club_pixel_backend.repository.TournamentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final GameRepository gameRepository;

    public TournamentService(
            TournamentRepository tournamentRepository,
            GameRepository gameRepository
    ) {
        this.tournamentRepository = tournamentRepository;
        this.gameRepository = gameRepository;
    }

    public Tournament create(TournamentRequest request) {
        Game game = gameRepository.findById(request.getGameId())
                .orElseThrow(() ->
                        new RuntimeException("Game not found"));

        Tournament tournament = Tournament.builder()
                .title(request.getTitle())
                .game(game)
                .startDate(request.getStartDate())
                .format(request.getFormat())
                .description(request.getDescription())
                .location(request.getLocation())
                .maxTeams(request.getMaxTeams())
                .registrationOpen(
                        request.getRegistrationOpen() != null
                                ? request.getRegistrationOpen()
                                : true
                )
                .status(
                        request.getStatus() != null
                                ? request.getStatus()
                                : TournamentStatus.DRAFT
                )
                .build();

        return tournamentRepository.save(tournament);
    }

    public List<Tournament> getPublished() {
        return tournamentRepository
                .findByStatusOrderByStartDateAsc(
                        TournamentStatus.PUBLISHED
                );
    }

    public Tournament getPublishedById(Long id) {
        return tournamentRepository
                .findByIdAndStatus(
                        id,
                        TournamentStatus.PUBLISHED
                )
                .orElseThrow(() ->
                        new RuntimeException("Tournament not found"));
    }

    public Tournament update(
            Long id,
            TournamentRequest request
    ) {
        Tournament tournament = tournamentRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Tournament not found"
                        ));

        Game game = gameRepository
                .findById(request.getGameId())
                .orElseThrow(() ->
                        new RuntimeException("Game not found"));

        tournament.setTitle(request.getTitle());
        tournament.setGame(game);
        tournament.setStartDate(request.getStartDate());
        tournament.setFormat(request.getFormat());
        tournament.setDescription(request.getDescription());
        tournament.setLocation(request.getLocation());
        tournament.setMaxTeams(request.getMaxTeams());
        tournament.setRegistrationOpen(
                request.getRegistrationOpen()
        );

        if (request.getStatus() != null) {
            tournament.setStatus(request.getStatus());
        }

        return tournamentRepository.save(tournament);
    }

    public void cancel(Long id) {
        Tournament tournament = tournamentRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Tournament not found"
                        ));

        tournament.setStatus(TournamentStatus.CANCELLED);
        tournament.setRegistrationOpen(false);

        tournamentRepository.save(tournament);
    }
}