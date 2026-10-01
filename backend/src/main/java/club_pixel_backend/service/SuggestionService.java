package club_pixel_backend.service;

import club_pixel_backend.dto.SuggestionRequest;
import club_pixel_backend.entity.Suggestion;
import club_pixel_backend.entity.SuggestionStatus;
import club_pixel_backend.repository.SuggestionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SuggestionService {

    private final SuggestionRepository repository;

    public SuggestionService(
            SuggestionRepository repository
    ) {
        this.repository = repository;
    }

    public Suggestion create(SuggestionRequest request, Long authorId) {
        Suggestion suggestion = Suggestion.builder()
                .authorId(authorId)
                .name(request.getName())
                .type(request.getType())
                .description(request.getDescription())
                .preferredDate(request.getPreferredDate())
                .status(SuggestionStatus.PENDING)
                .build();

        return repository.save(suggestion);
    }
    public List<Suggestion> getAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public Suggestion updateStatus(
            Long id,
            SuggestionStatus status
    ) {
        Suggestion suggestion = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Suggestion not found"));

        suggestion.setStatus(status);

        return repository.save(suggestion);
    }
}