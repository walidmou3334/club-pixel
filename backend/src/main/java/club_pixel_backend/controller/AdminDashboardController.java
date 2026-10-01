package club_pixel_backend.controller;

import club_pixel_backend.dto.DashboardResponse;
import club_pixel_backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final DashboardService service;

    public AdminDashboardController(
            DashboardService service
    ) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getStats() {
        return ResponseEntity.ok(service.getStats());
    }
}