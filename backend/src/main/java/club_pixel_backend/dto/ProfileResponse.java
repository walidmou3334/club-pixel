package club_pixel_backend.dto;
public record ProfileResponse(Long id, String name, String email, String role, String program, java.util.Set<String> interests) {}
