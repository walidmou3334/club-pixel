package club_pixel_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileUpdateRequest {

    @NotBlank
    private String name;
    @jakarta.validation.constraints.Size(max=255) private String program;
    @jakarta.validation.constraints.Size(max=8) private java.util.Set<@jakarta.validation.constraints.Pattern(regexp="Gaming|Esports|Board Games|Casual Games|Community|Events") String> interests;
}