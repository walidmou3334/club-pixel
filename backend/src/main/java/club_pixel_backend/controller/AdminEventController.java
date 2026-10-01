package club_pixel_backend.controller;

import club_pixel_backend.dto.AdminRegistrationResponse;
import club_pixel_backend.entity.EventRegistration;
import club_pixel_backend.repository.EventRegistrationRepository;
import club_pixel_backend.repository.EventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@org.springframework.transaction.annotation.Transactional(readOnly=true)
@RequestMapping("/api/admin/events")
public class AdminEventController {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;

    public AdminEventController(
            EventRepository eventRepository,
            EventRegistrationRepository registrationRepository
    ) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    @GetMapping("/{eventId}/registrations")
    public ResponseEntity<?> getRegistrations(
            @PathVariable Long eventId
    ) {
        if (!eventRepository.existsById(eventId)) {
            return ResponseEntity.notFound().build();
        }

        List<AdminRegistrationResponse> response =
                registrationRepository.findByEventId(eventId)
                        .stream()
                        .map(registration ->
                                new AdminRegistrationResponse(
                                        registration.getId(),
                                        registration.getUser().getId(),
                                        registration.getUser().getName(),
                                        registration.getUser().getEmail(),
                                        registration.getStatus().name(),
                                        registration.getRegisteredAt()
                                )
                        )
                        .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/{eventId}/registrations.csv", produces = "text/csv;charset=UTF-8")
    public ResponseEntity<String> exportRegistrations(@PathVariable Long eventId) {
        if (!eventRepository.existsById(eventId)) return ResponseEntity.notFound().build();
        var csv = new StringBuilder("\uFEFFRegistration ID,Name,Email,Program,Registered at\r\n");
        registrationRepository.findByEventId(eventId).stream()
                .filter(r -> r.getStatus() == club_pixel_backend.entity.RegistrationStatus.REGISTERED)
                .sorted(java.util.Comparator.comparing(EventRegistration::getId))
                .forEach(r -> csv.append(r.getId()).append(',')
                        .append(csvCell(r.getUser().getName())).append(',')
                        .append(csvCell(r.getUser().getEmail())).append(',')
                        .append(csvCell(r.getUser().getProgram())).append(',')
                        .append(csvCell(String.valueOf(r.getRegisteredAt()))).append("\r\n"));
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"pixel-event-" + eventId + "-participants.csv\"")
                .header("Cache-Control", "no-store")
                .body(csv.toString());
    }

    private static String csvCell(String value) {
        String cell = value == null ? "" : value;
        // Keep spreadsheet applications from interpreting member-provided text as a formula.
        if (cell.stripLeading().matches("(?s)^[=+@\\-].*" ) || cell.startsWith("\t") || cell.startsWith("\r") || cell.startsWith("\n")) cell = "'" + cell;
        return "\"" + cell.replace("\"", "\"\"") + "\"";
    }
}
