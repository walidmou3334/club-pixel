package club_pixel_backend.dto;

import java.time.LocalDateTime;

public record AdminTournamentRegistrationResponse(
        Long registrationId,
        Long userId,
        String userName,
        String userEmail,
        String status,
        LocalDateTime registeredAt
) {
}