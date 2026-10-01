package club_pixel_backend.dto;

import java.time.LocalDate;

public record TournamentResponse(
        Long id,
        String title,
        Long gameId,
        String gameName,
        LocalDate startDate,
        String format,
        String description,
        String location,
        Integer maxTeams,
        Boolean registrationOpen,
        String status
) {
}