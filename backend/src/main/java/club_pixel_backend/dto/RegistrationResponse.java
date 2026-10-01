package club_pixel_backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record RegistrationResponse(
        Long id,
        Long eventId,
        String eventTitle,
        LocalDate eventDate,
        String status,
        LocalDateTime registeredAt
) {
}