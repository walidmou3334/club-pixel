package club_pixel_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "membership_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    private String program;

    @Column(columnDefinition = "TEXT")
    private String motivation;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name="application_interests", joinColumns=@JoinColumn(name="application_id"))
    @Column(name="interest") @Builder.Default
    private java.util.Set<String> interests = new java.util.HashSet<>();

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MembershipStatus status = MembershipStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}