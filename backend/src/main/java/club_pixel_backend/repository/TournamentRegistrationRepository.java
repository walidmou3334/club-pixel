package club_pixel_backend.repository;

import club_pixel_backend.entity.RegistrationStatus;
import club_pixel_backend.entity.TournamentRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TournamentRegistrationRepository
        extends JpaRepository<TournamentRegistration, Long> {

    Optional<TournamentRegistration>
    findByUserIdAndTournamentId(
            Long userId,
            Long tournamentId
    );

    List<TournamentRegistration>
    findByUserId(Long userId);

    List<TournamentRegistration>
    findByTournamentId(Long tournamentId);

    long countByTournamentIdAndStatus(
            Long tournamentId,
            RegistrationStatus status
    );
}