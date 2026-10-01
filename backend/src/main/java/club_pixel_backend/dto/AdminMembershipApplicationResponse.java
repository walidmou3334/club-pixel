package club_pixel_backend.dto;

import java.time.LocalDateTime;

public record AdminMembershipApplicationResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String program,
        String motivation,
        String status,
        LocalDateTime createdAt, java.util.Set<String> interests
) {
}