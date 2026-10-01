package club_pixel_backend.dto;

import club_pixel_backend.entity.SuggestionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateSuggestionStatusRequest {

    @NotNull
    private SuggestionStatus status;
}