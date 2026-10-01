package club_pixel_backend.repository;

import club_pixel_backend.entity.Event;
import club_pixel_backend.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatusOrderByEventDateAsc(EventStatus status);
    Optional<Event> findByIdAndStatus(
            Long id,
            EventStatus status
    );
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select e from Event e where e.id = :id and e.status = :status")
    java.util.Optional<Event> findForRegistration(@org.springframework.data.repository.query.Param("id") Long id, @org.springframework.data.repository.query.Param("status") EventStatus status);
}