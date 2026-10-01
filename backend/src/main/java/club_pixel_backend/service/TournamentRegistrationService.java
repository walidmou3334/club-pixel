package club_pixel_backend.service;

import club_pixel_backend.entity.*;
import club_pixel_backend.repository.TournamentRegistrationRepository;
import club_pixel_backend.repository.TournamentRepository;
import club_pixel_backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class TournamentRegistrationService {

    private final TournamentRegistrationRepository registrationRepository;
    private final TournamentRepository tournamentRepository;
    private final UserRepository userRepository;

    public TournamentRegistrationService(
            TournamentRegistrationRepository registrationRepository,
            TournamentRepository tournamentRepository,
            UserRepository userRepository
    ) {
        this.registrationRepository = registrationRepository;
        this.tournamentRepository = tournamentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TournamentRegistration register(
            Long tournamentId,
            String email
    ) {
        Tournament tournament = tournamentRepository
                .findForRegistration(
                        tournamentId,
                        TournamentStatus.PUBLISHED
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Tournament not found"
                        ));

        if (Boolean.FALSE.equals(
                tournament.getRegistrationOpen()
        )) {
            throw new RuntimeException(
                    "Tournament registration is closed"
            );
        }

        if (tournament.getMaxTeams() != null) {
            long count = registrationRepository
                    .countByTournamentIdAndStatus(
                            tournamentId,
                            RegistrationStatus.REGISTERED
                    );

            if (count >= tournament.getMaxTeams()) {
                throw new RuntimeException(
                        "Tournament is full"
                );
            }
        }

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        var existing = registrationRepository
                .findByUserIdAndTournamentId(
                        user.getId(),
                        tournamentId
                );

        if (existing.isPresent()) {
            TournamentRegistration registration =
                    existing.get();

            if (registration.getStatus()
                    == RegistrationStatus.REGISTERED) {
                throw new RuntimeException(
                        "User already registered"
                );
            }

            registration.setStatus(
                    RegistrationStatus.REGISTERED
            );
            registration.setRegisteredAt(
                    LocalDateTime.now()
            );

            return registrationRepository.save(registration);
        }

        TournamentRegistration registration =
                TournamentRegistration.builder()
                        .user(user)
                        .tournament(tournament)
                        .status(RegistrationStatus.REGISTERED)
                        .registeredAt(LocalDateTime.now())
                        .build();

        return registrationRepository.save(registration);
    }

    @Transactional
    public void cancelRegistration(
            Long tournamentId,
            String email
    ) {
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        TournamentRegistration registration =
                registrationRepository
                        .findByUserIdAndTournamentId(
                                user.getId(),
                                tournamentId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Registration not found"
                                ));

        registration.setStatus(
                RegistrationStatus.CANCELLED
        );

        registrationRepository.save(registration);
    }
}