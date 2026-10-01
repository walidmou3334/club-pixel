package club_pixel_backend.service;

import club_pixel_backend.dto.GalleryRequest;
import club_pixel_backend.entity.GalleryItem;
import club_pixel_backend.repository.GalleryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GalleryService {

    private final GalleryRepository repository;

    public GalleryService(GalleryRepository repository) {
        this.repository = repository;
    }

    public GalleryItem create(GalleryRequest request) {
        GalleryItem item = GalleryItem.builder()
                .category(request.getCategory())
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .eventDate(request.getEventDate())
                .active(true)
                .build();

        return repository.save(item);
    }

    public List<GalleryItem> getActiveItems() {
        return repository
                .findByActiveTrueOrderByEventDateDesc();
    }

    public GalleryItem update(
            Long id,
            GalleryRequest request
    ) {
        GalleryItem item = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Gallery item not found"
                        ));

        item.setCategory(request.getCategory());
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setImageUrl(request.getImageUrl());
        item.setEventDate(request.getEventDate());

        return repository.save(item);
    }

    public void deactivate(Long id) {
        GalleryItem item = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Gallery item not found"
                        ));

        item.setActive(false);
        repository.save(item);
    }
}