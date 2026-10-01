package club_pixel_backend.repository;

import club_pixel_backend.entity.Tournament;
import club_pixel_backend.entity.TournamentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TournamentRepository
        extends JpaRepository<Tournament, Long> {

    List<Tournament> findByStatusOrderByStartDateAsc(
            TournamentStatus status
    );

    Optional<Tournament> findByIdAndStatus(
            Long id,
            TournamentStatus status
    );
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select e from Tournament e where e.id = :id and e.status = :status")
    java.util.Optional<Tournament> findForRegistration(@org.springframework.data.repository.query.Param("id") Long id, @org.springframework.data.repository.query.Param("status") TournamentStatus status);
}