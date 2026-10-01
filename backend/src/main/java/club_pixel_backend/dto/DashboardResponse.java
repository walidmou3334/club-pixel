package club_pixel_backend.dto;

public record DashboardResponse(
        long totalUsers,
        long totalEvents,
        long totalEventRegistrations,
        long totalMembershipApplications,
        long totalSuggestions,
        long totalGames,
        long totalTournaments
) {
}