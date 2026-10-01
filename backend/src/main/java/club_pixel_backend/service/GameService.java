package club_pixel_backend.service;

import club_pixel_backend.dto.GameRequest;
import club_pixel_backend.entity.Game;
import club_pixel_backend.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {

    private final GameRepository repository;

    public GameService(GameRepository repository) {
        this.repository = repository;
    }

    public Game create(GameRequest request) {
        Game game = Game.builder()
                .name(request.getName())
                .genre(request.getGenre())
                .players(request.getPlayers())
                .category(request.getCategory())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .emoji(request.getEmoji())
                .color(request.getColor())
                .active(true)
                .build();

        return repository.save(game);
    }

    public List<Game> getActiveGames() {
        return repository.findByActiveTrueOrderByNameAsc();
    }

    public Game update(Long id, GameRequest request) {
        Game game = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Game not found"));

        game.setName(request.getName());
        game.setGenre(request.getGenre());
        game.setPlayers(request.getPlayers());
        game.setCategory(request.getCategory());
        game.setDescription(request.getDescription());
        game.setImageUrl(request.getImageUrl());
        game.setEmoji(request.getEmoji());
        game.setColor(request.getColor());

        return repository.save(game);
    }

    public void deactivate(Long id) {
        Game game = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Game not found"));

        game.setActive(false);
        repository.save(game);
    }
}