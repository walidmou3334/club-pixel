package club_pixel_backend.repository;

import club_pixel_backend.entity.Game;
import club_pixel_backend.entity.GameCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRepository
        extends JpaRepository<Game, Long> {

    List<Game> findByActiveTrueOrderByNameAsc();

    List<Game> findByCategoryAndActiveTrueOrderByNameAsc(
            GameCategory category
    );
}