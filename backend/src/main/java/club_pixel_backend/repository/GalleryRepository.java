package club_pixel_backend.repository;

import club_pixel_backend.entity.GalleryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryRepository
        extends JpaRepository<GalleryItem, Long> {

    List<GalleryItem> findByActiveTrueOrderByEventDateDesc();

    List<GalleryItem> findAllByOrderByCreatedAtDesc();
}