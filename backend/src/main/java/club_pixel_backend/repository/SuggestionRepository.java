package club_pixel_backend.repository;

import club_pixel_backend.entity.Suggestion;
import club_pixel_backend.entity.SuggestionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SuggestionRepository
        extends JpaRepository<Suggestion, Long> {

    List<Suggestion> findAllByOrderByCreatedAtDesc();

    List<Suggestion> findByStatusOrderByCreatedAtDesc(
            SuggestionStatus status
    );
}