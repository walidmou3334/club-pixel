package club_pixel_backend.dto;

import club_pixel_backend.entity.MembershipStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateMembershipStatusRequest {

    @NotNull
    private MembershipStatus status;
}