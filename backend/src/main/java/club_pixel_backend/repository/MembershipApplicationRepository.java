package club_pixel_backend.repository;

import club_pixel_backend.entity.MembershipApplication;
import club_pixel_backend.entity.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MembershipApplicationRepository
        extends JpaRepository<MembershipApplication, Long> {

    List<MembershipApplication> findByStatusOrderByCreatedAtDesc(
            MembershipStatus status
    );

    List<MembershipApplication> findByEmailOrderByCreatedAtDesc(
            String email
    );

    boolean existsByEmailAndStatus(
            String email,
            MembershipStatus status
    );

    List<MembershipApplication> findAllByOrderByCreatedAtDesc();
}