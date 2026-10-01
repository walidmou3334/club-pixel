package club_pixel_backend.controller;
import club_pixel_backend.entity.*;
import club_pixel_backend.repository.*;
import club_pixel_backend.dto.TournamentResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
@RestController @RequestMapping("/api") @Transactional(readOnly=true)
public class ActivityReadController {
 private final EventRepository events;private final TournamentRepository tournaments;private final EventRegistrationRepository registrations;
 public ActivityReadController(EventRepository events,TournamentRepository tournaments,EventRegistrationRepository registrations){this.events=events;this.tournaments=tournaments;this.registrations=registrations;}
 @GetMapping("/events/archive") public List<Event> events(){return events.findByStatusOrderByEventDateAsc(EventStatus.COMPLETED);}
 @GetMapping("/tournaments/archive") public List<TournamentResponse> tournaments(){return tournaments.findByStatusOrderByStartDateAsc(TournamentStatus.COMPLETED).stream().map(t->new TournamentResponse(t.getId(),t.getTitle(),t.getGame().getId(),t.getGame().getName(),t.getStartDate(),t.getFormat(),t.getDescription(),t.getLocation(),t.getMaxTeams(),t.getRegistrationOpen(),t.getStatus().name())).toList();}
 @GetMapping("/events/{id}/availability") public Map<String,Object> availability(@PathVariable Long id){var e=events.findById(id).filter(x->x.getStatus()==EventStatus.PUBLISHED||x.getStatus()==EventStatus.COMPLETED).orElseThrow(()->new IllegalArgumentException("Event unavailable"));long count=registrations.countByEventIdAndStatus(id,RegistrationStatus.REGISTERED);Map<String,Object> m=new LinkedHashMap<>();m.put("registered",count);m.put("capacity",e.getCapacity());m.put("remaining",e.getCapacity()==null?null:Math.max(0,e.getCapacity()-count));return m;}
}
