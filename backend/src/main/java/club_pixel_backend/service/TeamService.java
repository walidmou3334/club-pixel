package club_pixel_backend.service;

import club_pixel_backend.dto.TeamMemberRequest;
import club_pixel_backend.entity.TeamMember;
import club_pixel_backend.repository.TeamRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {

    private final TeamRepository repository;

    public TeamService(TeamRepository repository) {
        this.repository = repository;
    }

    public TeamMember create(TeamMemberRequest request) {
        TeamMember member = TeamMember.builder()
                .name(request.getName())
                .role(request.getRole())
                .bio(request.getBio())
                .imageUrl(request.getImageUrl())
                .email(request.getEmail())
                .linkedinUrl(request.getLinkedinUrl())
                .discordUsername(request.getDiscordUsername())
                .displayOrder(
                        request.getDisplayOrder() != null
                                ? request.getDisplayOrder()
                                : 0
                )
                .active(true)
                .build();

        return repository.save(member);
    }

    public List<TeamMember> getActiveMembers() {
        return repository.findByActiveTrueOrderByDisplayOrderAsc();
    }

    public TeamMember update(
            Long id,
            TeamMemberRequest request
    ) {
        TeamMember member = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Team member not found"
                        ));

        member.setName(request.getName());
        member.setRole(request.getRole());
        member.setBio(request.getBio());
        member.setImageUrl(request.getImageUrl());
        member.setEmail(request.getEmail());
        member.setLinkedinUrl(request.getLinkedinUrl());
        member.setDiscordUsername(
                request.getDiscordUsername()
        );
        member.setDisplayOrder(
                request.getDisplayOrder()
        );

        return repository.save(member);
    }

    public void deactivate(Long id) {
        TeamMember member = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Team member not found"
                        ));

        member.setActive(false);
        repository.save(member);
    }
}