package club_pixel_backend.controller;
import club_pixel_backend.entity.*;
import club_pixel_backend.repository.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import java.util.*;
@RestController @RequestMapping("/api") @Transactional
public class MemberFeaturesController {
 private final UserRepository users; private final GameRepository games;
 private final SuggestionRepository suggestions; private final TournamentRegistrationRepository registrations;
 public MemberFeaturesController(UserRepository users,GameRepository games,SuggestionRepository suggestions,TournamentRegistrationRepository registrations){this.users=users;this.games=games;this.suggestions=suggestions;this.registrations=registrations;}
 private User user(Authentication auth){return users.findByEmail(auth.getName()).orElseThrow();}
 @GetMapping("/users/me/favorite-games") public List<Game> favorites(Authentication a){return user(a).getFavoriteGames().stream().filter(g->Boolean.TRUE.equals(g.getActive())).sorted(Comparator.comparing(Game::getName)).toList();}
 @PutMapping("/users/me/favorite-games/{id}") public ResponseEntity<Void> favorite(@PathVariable Long id,Authentication a){var g=games.findById(id).filter(x->Boolean.TRUE.equals(x.getActive())).orElseThrow(()->new IllegalArgumentException("Game unavailable"));user(a).getFavoriteGames().add(g);return ResponseEntity.noContent().build();}
 @DeleteMapping("/users/me/favorite-games/{id}") public ResponseEntity<Void> unfavorite(@PathVariable Long id,Authentication a){user(a).getFavoriteGames().removeIf(g->g.getId().equals(id));return ResponseEntity.noContent().build();}
 @GetMapping("/suggestions/mine") public List<Suggestion> suggestions(Authentication a){Long id=user(a).getId();return suggestions.findAllByOrderByCreatedAtDesc().stream().filter(s->id.equals(s.getAuthorId())).toList();}
 @GetMapping("/tournaments/my-registrations") public List<Map<String,Object>> tournaments(Authentication a){return registrations.findByUserId(user(a).getId()).stream().map(r->{Map<String,Object> m=new LinkedHashMap<>();m.put("id",r.getId());m.put("tournamentId",r.getTournament().getId());m.put("title",r.getTournament().getTitle());m.put("date",r.getTournament().getStartDate());m.put("status",r.getStatus());return m;}).toList();}
}
