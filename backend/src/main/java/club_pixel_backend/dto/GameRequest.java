package club_pixel_backend.dto;

import club_pixel_backend.entity.GameCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameRequest {

    @NotBlank
    private String name;

    private String genre;
    private String players;

    @NotNull
    private GameCategory category;

    private String description;
    private String imageUrl;
    private String emoji;
    private String color;
}