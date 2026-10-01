package club_pixel_backend.dto;

import club_pixel_backend.entity.EventStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class EventRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private String shortDescription;

    @NotNull
    private LocalDate eventDate;

    private LocalTime startTime;
    private LocalTime endTime;
    private String location;
    @jakarta.validation.constraints.Positive
    private Integer capacity;
    private EventStatus status;
    private Boolean registrationOpen;
    private String imageUrl;
}