package club_pixel_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tournaments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    private LocalDate startDate;
    private String format;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;
    private Integer maxTeams;

    @Builder.Default
    private Boolean registrationOpen = true;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TournamentStatus status = TournamentStatus.DRAFT;
}