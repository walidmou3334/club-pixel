package club_pixel_backend.controller;

import club_pixel_backend.service.CloudinaryService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/uploads")
public class ImageUploadController {

    private final CloudinaryService cloudinaryService;

    public ImageUploadController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping(
            value = "/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file
    ) {
        try {
            Map result = cloudinaryService.uploadImage(file);

            return ResponseEntity.ok(Map.of(
                    "url", result.get("secure_url"),
                    "publicId", result.get("public_id")
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Image upload failed")
            );
        }
    }
}