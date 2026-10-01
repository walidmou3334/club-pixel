package club_pixel_backend.service;

import club_pixel_backend.dto.DashboardResponse;
import club_pixel_backend.repository.*;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final MembershipApplicationRepository membershipApplicationRepository;
    private final SuggestionRepository suggestionRepository;
    private final GameRepository gameRepository;
    private final TournamentRepository tournamentRepository;

    public DashboardService(
            UserRepository userRepository,
            EventRepository eventRepository,
            EventRegistrationRepository eventRegistrationRepository,
            MembershipApplicationRepository membershipApplicationRepository,
            SuggestionRepository suggestionRepository,
            GameRepository gameRepository,
            TournamentRepository tournamentRepository
    ) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.eventRegistrationRepository =
                eventRegistrationRepository;
        this.membershipApplicationRepository =
                membershipApplicationRepository;
        this.suggestionRepository = suggestionRepository;
        this.gameRepository = gameRepository;
        this.tournamentRepository = tournamentRepository;
    }

    public DashboardResponse getStats() {
        return new DashboardResponse(
                userRepository.count(),
                eventRepository.count(),
                eventRegistrationRepository.count(),
                membershipApplicationRepository.count(),
                suggestionRepository.count(),
                gameRepository.count(),
                tournamentRepository.count()
        );
    }
}