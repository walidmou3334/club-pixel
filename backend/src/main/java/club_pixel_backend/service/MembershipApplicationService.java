package club_pixel_backend.service;

import club_pixel_backend.dto.MembershipApplicationRequest;
import club_pixel_backend.entity.MembershipApplication;
import club_pixel_backend.entity.MembershipStatus;
import club_pixel_backend.repository.MembershipApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class MembershipApplicationService {

    private final MembershipApplicationRepository repository;

    public MembershipApplicationService(
            MembershipApplicationRepository repository
    ) {
        this.repository = repository;
    }

    public MembershipApplication apply(
            MembershipApplicationRequest request
    ) {
        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (repository.existsByEmailAndStatus(
                email,
                MembershipStatus.PENDING
        )) {
            throw new RuntimeException(
                    "You already have a pending application"
            );
        }

        MembershipApplication application =
                MembershipApplication.builder()
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .email(email)
                        .program(request.getProgram())
                        .motivation(request.getMotivation())
                        .interests(request.getInterests()==null ? new java.util.HashSet<>() : request.getInterests())
                        .status(MembershipStatus.PENDING)
                        .build();

        return repository.save(application);
    }

    public MembershipApplication updateStatus(
            Long id,
            MembershipStatus status
    ) {
        MembershipApplication application =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                ));

        application.setStatus(status);

        return repository.save(application);
    }
}