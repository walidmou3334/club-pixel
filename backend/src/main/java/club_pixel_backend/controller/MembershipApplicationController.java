package club_pixel_backend.controller;

import club_pixel_backend.dto.MembershipApplicationRequest;
import club_pixel_backend.entity.MembershipApplication;
import club_pixel_backend.service.MembershipApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/membership-applications")
public class MembershipApplicationController {

    private final MembershipApplicationService service;

    public MembershipApplicationController(
            MembershipApplicationService service
    ) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> apply(
            @Valid @RequestBody MembershipApplicationRequest request
    ) {
        MembershipApplication application =
                service.apply(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                        "message",
                        "Application submitted successfully",
                        "id", application.getId(),
                        "status", application.getStatus()
                )
        );
    }
}