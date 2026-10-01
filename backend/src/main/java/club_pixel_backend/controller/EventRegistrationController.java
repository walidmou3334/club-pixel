package club_pixel_backend.controller;

import club_pixel_backend.entity.EventRegistration;
import club_pixel_backend.service.EventRegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import club_pixel_backend.dto.RegistrationResponse;
import java.util.stream.Collectors;

import java.util.Map;

@RestController
@org.springframework.transaction.annotation.Transactional
@RequestMapping("/api/events")
public class EventRegistrationController {

    private final EventRegistrationService registrationService;

    public EventRegistrationController(
            EventRegistrationService registrationService
    ) {
        this.registrationService = registrationService;
    }

    @PostMapping("/{eventId}/register")
    public ResponseEntity<?> register(
            @PathVariable Long eventId,
            Authentication authentication
    ) {
        EventRegistration registration =
                registrationService.register(
                        eventId,
                        authentication.getName()
                );

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                        "message", "Registration successful",
                        "registrationId", registration.getId(),
                        "eventId", eventId,
                        "email", authentication.getName(),
                        "status", registration.getStatus()
                )
        );
    }

    @GetMapping("/my-registrations")
    public ResponseEntity<?> getMyRegistrations(
            Authentication authentication
    ) {
        var registrations = registrationService.getMyRegistrations(
                authentication.getName()
        );

        var response = registrations.stream()
                .map(registration -> new RegistrationResponse(
                        registration.getId(),
                        registration.getEvent().getId(),
                        registration.getEvent().getTitle(),
                        registration.getEvent().getEventDate(),
                        registration.getStatus().name(),
                        registration.getRegisteredAt()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{eventId}/register")
    public ResponseEntity<Void> cancelRegistration(
            @PathVariable Long eventId,
            Authentication authentication
    ) {
        registrationService.cancelRegistration(
                eventId,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }
}