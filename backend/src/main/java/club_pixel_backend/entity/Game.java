package club_pixel_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "games")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String genre;
    private String players;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameCategory category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;
    private String emoji;
    private String color;

    @Builder.Default
    private Boolean active = true;
}