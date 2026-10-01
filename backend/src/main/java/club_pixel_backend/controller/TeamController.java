package club_pixel_backend.controller;

import club_pixel_backend.dto.TeamMemberRequest;
import club_pixel_backend.entity.TeamMember;
import club_pixel_backend.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team")
public class TeamController {

    private final TeamService service;

    public TeamController(TeamService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TeamMember>> getActiveMembers() {
        return ResponseEntity.ok(service.getActiveMembers());
    }

    @PostMapping
    public ResponseEntity<TeamMember> create(
            @Valid @RequestBody TeamMemberRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamMember> update(
            @PathVariable Long id,
            @Valid @RequestBody TeamMemberRequest request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(
            @PathVariable Long id
    ) {
        service.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}