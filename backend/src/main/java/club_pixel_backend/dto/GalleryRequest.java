package club_pixel_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class GalleryRequest {

    @NotBlank
    private String title;

    private String description;
    @jakarta.validation.constraints.Pattern(regexp="GAMING|BOARD|EVENTS|COMMUNITY")
    private String category;

    @NotBlank
    private String imageUrl;

    private LocalDate eventDate;
}