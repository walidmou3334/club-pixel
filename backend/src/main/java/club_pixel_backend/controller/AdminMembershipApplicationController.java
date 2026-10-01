package club_pixel_backend.controller;

import club_pixel_backend.dto.AdminMembershipApplicationResponse;
import club_pixel_backend.dto.UpdateMembershipStatusRequest;
import club_pixel_backend.repository.MembershipApplicationRepository;
import club_pixel_backend.service.MembershipApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin/membership-applications")
public class AdminMembershipApplicationController {

    private final MembershipApplicationRepository repository;
    private final MembershipApplicationService service;

    public AdminMembershipApplicationController(
            MembershipApplicationRepository repository,
            MembershipApplicationService service
    ) {
        this.repository = repository;
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<?> getAllApplications() {
        var response = repository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(application ->
                        new AdminMembershipApplicationResponse(
                                application.getId(),
                                application.getFirstName(),
                                application.getLastName(),
                                application.getEmail(),
                                application.getProgram(),
                                application.getMotivation(),
                                application.getStatus().name(),
                                application.getCreatedAt(), application.getInterests()
                        )
                )
                .toList();

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMembershipStatusRequest request
    ) {
        var application = service.updateStatus(
                id,
                request.getStatus()
        );

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message", "Application status updated",
                        "id", application.getId(),
                        "status", application.getStatus()
                )
        );
    }
}