package club_pixel_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MembershipApplicationRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String email;

    private String program;
    private String motivation;
    @jakarta.validation.constraints.Size(max=8)
    private java.util.Set<@jakarta.validation.constraints.Pattern(regexp="Gaming|Esports|Board Games|Casual Games|Community|Events") String> interests = new java.util.HashSet<>();
}