package club_pixel_backend.service;

import club_pixel_backend.dto.ProfileResponse;
import club_pixel_backend.dto.ProfileUpdateRequest;
import club_pixel_backend.entity.User;
import club_pixel_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@org.springframework.transaction.annotation.Transactional
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ProfileResponse getProfile(String email) {
        User user = findUser(email);
        return toResponse(user);
    }

    public ProfileResponse updateProfile(
            String email,
            ProfileUpdateRequest request
    ) {
        User user = findUser(email);

        user.setName(request.getName());
        user.setProgram(request.getProgram());
        if(request.getInterests()!=null) user.setInterests(new java.util.HashSet<>(request.getInterests()));

        return toResponse(userRepository.save(user));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    private ProfileResponse toResponse(User user) {
        return new ProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(), user.getProgram(), java.util.Set.copyOf(user.getInterests())
        );
    }
}