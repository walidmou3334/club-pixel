package club_pixel_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeamMemberRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String role;

    private String bio;
    private String imageUrl;
    private String email;
    private String linkedinUrl;
    private String discordUsername;
    private Integer displayOrder;
}