package club_pixel_backend.dto;

import club_pixel_backend.entity.TournamentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TournamentRequest {

    @NotBlank
    private String title;

    @NotNull
    private Long gameId;

    private LocalDate startDate;
    private String format;
    private String description;
    private String location;
    @jakarta.validation.constraints.Positive
    private Integer maxTeams;
    private Boolean registrationOpen;
    private TournamentStatus status;
}