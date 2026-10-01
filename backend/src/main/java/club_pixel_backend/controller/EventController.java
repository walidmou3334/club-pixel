package club_pixel_backend.controller;

import club_pixel_backend.entity.Event;
import club_pixel_backend.entity.EventStatus;
import club_pixel_backend.repository.EventRepository;
import org.springframework.web.bind.annotation.*;
import club_pixel_backend.dto.EventRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @GetMapping
    public List<Event> getPublishedEvents() {
        return eventRepository
                .findByStatusOrderByEventDateAsc(EventStatus.PUBLISHED);
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(
            @Valid @RequestBody EventRequest request
    ) {
        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .shortDescription(request.getShortDescription())
                .eventDate(request.getEventDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .location(request.getLocation())
                .capacity(request.getCapacity())
                .status(request.getStatus() != null
                        ? request.getStatus()
                        : EventStatus.DRAFT)
                .registrationOpen(request.getRegistrationOpen() != null
                        ? request.getRegistrationOpen()
                        : true)
                .imageUrl(request.getImageUrl())
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(eventRepository.save(event));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(
            @PathVariable Long id
    ) {
        return eventRepository
                .findByIdAndStatus(id, EventStatus.PUBLISHED)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request
    ) {
        var optionalEvent = eventRepository.findById(id);

        if (optionalEvent.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Event event = optionalEvent.get();

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setShortDescription(request.getShortDescription());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setLocation(request.getLocation());
        event.setCapacity(request.getCapacity());
        if(request.getStatus()!=null) event.setStatus(request.getStatus());
        if(request.getRegistrationOpen()!=null) event.setRegistrationOpen(request.getRegistrationOpen());
        event.setImageUrl(request.getImageUrl());

        return ResponseEntity.ok(eventRepository.save(event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id
    ) {
        if (!eventRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        Event event = eventRepository.findById(id).orElseThrow();
        event.setStatus(EventStatus.CANCELLED); event.setRegistrationOpen(false);
        eventRepository.save(event);

        return ResponseEntity.noContent().build();
    }
}