package club_pixel_backend.controller;

import club_pixel_backend.dto.GalleryRequest;
import club_pixel_backend.entity.GalleryItem;
import club_pixel_backend.service.GalleryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    private final GalleryService service;

    public GalleryController(GalleryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<GalleryItem>> getActiveItems() {
        return ResponseEntity.ok(service.getActiveItems());
    }

    @PostMapping
    public ResponseEntity<GalleryItem> create(
            @Valid @RequestBody GalleryRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GalleryItem> update(
            @PathVariable Long id,
            @Valid @RequestBody GalleryRequest request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(
            @PathVariable Long id
    ) {
        service.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}