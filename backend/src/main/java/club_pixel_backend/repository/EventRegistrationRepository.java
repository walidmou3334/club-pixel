package club_pixel_backend.repository;

import club_pixel_backend.entity.EventRegistration;
import club_pixel_backend.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRegistrationRepository
        extends JpaRepository<EventRegistration, Long> {

    boolean existsByUserIdAndEventId(
            Long userId,
            Long eventId
    );

    Optional<EventRegistration> findByUserIdAndEventId(
            Long userId,
            Long eventId
    );

    List<EventRegistration> findByUserId(Long userId);

    List<EventRegistration> findByEventId(Long eventId);

    long countByEventIdAndStatus(
            Long eventId,
            RegistrationStatus status
    );
}