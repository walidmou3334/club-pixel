package club_pixel_backend.repository;

import club_pixel_backend.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository
        extends JpaRepository<TeamMember, Long> {

    List<TeamMember>
    findByActiveTrueOrderByDisplayOrderAsc();
}