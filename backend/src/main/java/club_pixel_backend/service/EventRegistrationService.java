package club_pixel_backend.service;

import club_pixel_backend.entity.*;
import club_pixel_backend.repository.EventRegistrationRepository;
import club_pixel_backend.repository.EventRepository;
import club_pixel_backend.repository.UserRepository;
import org.springframework.stereotype.Service;


import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;

@Service
public class EventRegistrationService {

    private final EventRegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventRegistrationService(
            EventRegistrationRepository registrationRepository,
            EventRepository eventRepository,
            UserRepository userRepository
    ) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public EventRegistration register(
            Long eventId,
            String email
    ) {
        Event event = eventRepository
                .findForRegistration(eventId, EventStatus.PUBLISHED)
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));

        if (Boolean.FALSE.equals(event.getRegistrationOpen())) {
            throw new RuntimeException("Registration is closed");
        }

        if (event.getCapacity() != null) {
            long registered =
                    registrationRepository.countByEventIdAndStatus(
                            eventId,
                            RegistrationStatus.REGISTERED
                    );

            if (registered >= event.getCapacity()) {
                throw new RuntimeException("Event capacity is full");
            }
        }

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        var existing = registrationRepository
                .findByUserIdAndEventId(user.getId(), eventId);

        if (existing.isPresent()) {
            EventRegistration registration = existing.get();

            if (registration.getStatus()
                    == RegistrationStatus.REGISTERED) {
                throw new RuntimeException(
                        "User already registered"
                );
            }

            registration.setStatus(RegistrationStatus.REGISTERED);
            registration.setRegisteredAt(LocalDateTime.now());

            return registrationRepository.save(registration);
        }

        EventRegistration registration = EventRegistration.builder()
                .user(user)
                .event(event)
                .status(RegistrationStatus.REGISTERED)
                .registeredAt(LocalDateTime.now())
                .build();

        return registrationRepository.save(registration);
    }

    @Transactional(readOnly = true)
    public List<EventRegistration> getMyRegistrations(
            String email
    ) {
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return registrationRepository.findByUserId(user.getId());
    }

    @Transactional
    public void cancelRegistration(
            Long eventId,
            String email
    ) {
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        EventRegistration registration =
                registrationRepository
                        .findByUserIdAndEventId(
                                user.getId(),
                                eventId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Registration not found"
                                ));

        registration.setStatus(RegistrationStatus.CANCELLED);
        registrationRepository.save(registration);
    }
}