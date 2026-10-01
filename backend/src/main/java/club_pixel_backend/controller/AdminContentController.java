package club_pixel_backend.controller;
import club_pixel_backend.entity.*;
import club_pixel_backend.repository.*;
import club_pixel_backend.dto.TournamentResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.*;
@RestController @RequestMapping("/api/admin") @Transactional
public class AdminContentController {
 private final GameRepository games; private final EventRepository events; private final TournamentRepository tournaments;
 private final GalleryRepository gallery; private final TeamRepository team; private final UserRepository users;
 public AdminContentController(GameRepository games,EventRepository events,TournamentRepository tournaments,GalleryRepository gallery,TeamRepository team,UserRepository users){this.games=games;this.events=events;this.tournaments=tournaments;this.gallery=gallery;this.team=team;this.users=users;}
 @GetMapping("/games") public List<Game> games(){return games.findAll();}
 @GetMapping("/events") public List<Event> events(){return events.findAll();}
 @GetMapping("/tournaments") public List<TournamentResponse> tournaments(){return tournaments.findAll().stream().map(t->new TournamentResponse(t.getId(),t.getTitle(),t.getGame().getId(),t.getGame().getName(),t.getStartDate(),t.getFormat(),t.getDescription(),t.getLocation(),t.getMaxTeams(),t.getRegistrationOpen(),t.getStatus().name())).toList();}
 @GetMapping("/gallery") public List<GalleryItem> gallery(){return gallery.findAll();}
 @GetMapping("/team") public List<TeamMember> team(){return team.findAll();}
 public record ActiveRequest(@NotNull Boolean active){}
 @PatchMapping("/games/{id}/active") public Game gameActive(@PathVariable Long id,@Valid @RequestBody ActiveRequest r){var x=games.findById(id).orElseThrow();x.setActive(r.active());return games.save(x);}
 @PatchMapping("/gallery/{id}/active") public GalleryItem galleryActive(@PathVariable Long id,@Valid @RequestBody ActiveRequest r){var x=gallery.findById(id).orElseThrow();x.setActive(r.active());return gallery.save(x);}
 @PatchMapping("/team/{id}/active") public TeamMember teamActive(@PathVariable Long id,@Valid @RequestBody ActiveRequest r){var x=team.findById(id).orElseThrow();x.setActive(r.active());return team.save(x);}
 public record UserSummary(Long id,String name,String email,String role,String program,boolean enabled){}
 @GetMapping("/users") public List<UserSummary> users(){return users.findAll().stream().map(u->new UserSummary(u.getId(),u.getName(),u.getEmail(),u.getRole().name(),u.getProgram(),u.isEnabled())).toList();}
 public record EnabledRequest(@NotNull Boolean enabled){}
 @PatchMapping("/users/{id}/enabled") public ResponseEntity<Void> enabled(@PathVariable Long id,@Valid @RequestBody EnabledRequest r,Authentication a){var u=users.findById(id).orElseThrow();if(u.getRole()==Role.ADMIN)throw new IllegalArgumentException("Administrator accounts cannot be disabled here");u.setEnabled(r.enabled());users.save(u);return ResponseEntity.noContent().build();}
}
