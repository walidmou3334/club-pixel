package club_pixel_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SuggestionRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String type;

    private String description;
    private String preferredDate;
}