package club_pixel_backend.config;

import club_pixel_backend.security.JwtAuthenticationFilter;
import jakarta.servlet.DispatcherType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public org.springframework.security.core.userdetails.UserDetailsService unusedPasswordLogin() {
        return username -> { throw new org.springframework.security.core.userdetails.UsernameNotFoundException("Bearer authentication only"); };
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable())
                .exceptionHandling(errors -> errors
                    .authenticationEntryPoint((request, response, ex) -> { response.setStatus(401); response.setContentType("application/json"); response.getWriter().write("{\"message\":\"Authentication required\"}"); })
                    .accessDeniedHandler((request, response, ex) -> { response.setStatus(403); response.setContentType("application/json"); response.getWriter().write("{\"message\":\"Access denied\"}"); }))

                .cors(cors -> {})

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        .dispatcherTypeMatchers(
                                DispatcherType.ERROR,
                                DispatcherType.FORWARD
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        .requestMatchers("/error").permitAll()

                        .requestMatchers("/api/auth/**").permitAll()

                        // Personal reads must precede public wildcard reads.
                        .requestMatchers("/api/events/my-registrations", "/api/tournaments/my-registrations", "/api/suggestions/mine").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/events/*/register").hasAnyAuthority("ROLE_MEMBER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/events/*/register").hasAnyAuthority("ROLE_MEMBER", "ROLE_ADMIN")
                        // Events public
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/events",
                                "/api/events/**"
                        ).permitAll()

                        // Events admin
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/events",
                                "/api/events/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/events",
                                "/api/events/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/events",
                                "/api/events/**"
                        ).hasAuthority("ROLE_ADMIN")

                        // Membership application public
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/membership-applications"
                        ).permitAll()

                        // Visitors and members may submit; reading and moderation remain protected.
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/suggestions"
                        ).permitAll()

                        // Games public GET
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/games",
                                "/api/games/**"
                        ).permitAll()

                        // Games Admin
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/games",
                                "/api/games/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/games",
                                "/api/games/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/games",
                                "/api/games/**"
                        ).hasAuthority("ROLE_ADMIN")

                        // Tournament registration Member/Admin
                        // خاصها تجي قبل POST العام ديال tournaments
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/tournaments/*/register"
                        ).hasAnyAuthority(
                                "ROLE_MEMBER",
                                "ROLE_ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/tournaments/*/register"
                        ).hasAnyAuthority(
                                "ROLE_MEMBER",
                                "ROLE_ADMIN"
                        )

                        // Tournaments public GET
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/tournaments",
                                "/api/tournaments/**"
                        ).permitAll()

                        // Tournaments Admin
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/tournaments",
                                "/api/tournaments/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/tournaments",
                                "/api/tournaments/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/tournaments",
                                "/api/tournaments/**"
                        ).hasAuthority("ROLE_ADMIN")

                        // Gallery public GET
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/gallery",
                                "/api/gallery/**"
                        ).permitAll()

                        // Gallery Admin
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/gallery",
                                "/api/gallery/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/gallery",
                                "/api/gallery/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/gallery",
                                "/api/gallery/**"
                        ).hasAuthority("ROLE_ADMIN")

                        // Team public GET
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/team",
                                "/api/team/**"
                        ).permitAll()

                        // Team Admin
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/team",
                                "/api/team/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/team",
                                "/api/team/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/team",
                                "/api/team/**"
                        ).hasAuthority("ROLE_ADMIN")

                        // All Admin routes
                        .requestMatchers("/api/admin/**")
                        .hasAuthority("ROLE_ADMIN")

                        // باقي routes خاصها Login
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}