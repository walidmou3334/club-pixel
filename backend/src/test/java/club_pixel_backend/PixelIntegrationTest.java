package club_pixel_backend;

import club_pixel_backend.entity.*;
import club_pixel_backend.repository.*;
import club_pixel_backend.security.JwtService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.JsonNode;
import java.net.URI;
import java.net.http.*;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.*;
import static org.assertj.core.api.Assertions.*;

@Testcontainers
@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT)
class PixelIntegrationTest {
 @Container static PostgreSQLContainer<?> db=new PostgreSQLContainer<>("postgres:17-alpine");
 static final String KEY=Base64.getEncoder().encodeToString(new java.security.SecureRandom().generateSeed(48));
 @DynamicPropertySource static void properties(DynamicPropertyRegistry r){r.add("spring.datasource.url",db::getJdbcUrl);r.add("spring.datasource.username",db::getUsername);r.add("spring.datasource.password",db::getPassword);r.add("jwt.secret",()->KEY);}
 @Value("${local.server.port}") int port;
 @Autowired UserRepository users; @Autowired GameRepository games; @Autowired EventRepository events;
 @Autowired TournamentRepository tournaments; @Autowired PasswordEncoder passwords; @Autowired JwtService jwt;
 @Autowired org.flywaydb.core.Flyway flyway;
 @Autowired org.springframework.jdbc.core.JdbcTemplate jdbc;
 final HttpClient http=HttpClient.newHttpClient(); final JsonMapper json=JsonMapper.builder().build();
 User member,admin; String token,adminToken;
 @BeforeEach void accounts(){member=account(Role.MEMBER);admin=account(Role.ADMIN);token=jwt.generateToken(member);adminToken=jwt.generateToken(admin);}
 User account(Role role){return users.save(User.builder().name("Integration test").email(UUID.randomUUID()+"@example.invalid").password(passwords.encode("Test-pass-123!")).role(role).build());}
 HttpResponse<String> request(String method,String path,String bearer,Object body)throws Exception{var b=HttpRequest.newBuilder(URI.create("http://127.0.0.1:"+port+"/api"+path)).header("Content-Type","application/json");if(bearer!=null)b.header("Authorization","Bearer "+bearer);b.method(method,body==null?HttpRequest.BodyPublishers.noBody():HttpRequest.BodyPublishers.ofString(json.writeValueAsString(body)));return http.send(b.build(),HttpResponse.BodyHandlers.ofString());}
 JsonNode body(HttpResponse<String> r){return json.readTree(r.body());}
 Event event(int capacity){return events.save(Event.builder().title("Integration event").description("Test fixture only").eventDate(LocalDate.now().plusDays(10)).capacity(capacity).status(EventStatus.PUBLISHED).registrationOpen(true).build());}
 Game game(){return games.save(Game.builder().name("Integration game").category(GameCategory.ONLINE).active(true).build());}
 @Test void migrationsAreAppliedOnce(){flyway.validate();assertThat(flyway.info().applied()).hasSize(3);assertThat(flyway.migrate().migrationsExecuted).isZero();}
 @Test void anonymousAndInvalidTokensCannotReadProfile()throws Exception{assertThat(request("GET","/users/me",null,null).statusCode()).isEqualTo(401);assertThat(request("GET","/users/me","invalid",null).statusCode()).isEqualTo(401);}
 @Test void registrationForcesMemberAndHashesPassword()throws Exception{String email=UUID.randomUUID()+"@example.invalid";var r=request("POST","/auth/register",null,Map.of("name","Test","email",email,"password","Test-pass-123!","role","ADMIN"));assertThat(r.statusCode()).isEqualTo(201);assertThat(body(r).get("role").asText()).isEqualTo("MEMBER");var u=users.findByEmail(email).orElseThrow();assertThat(passwords.matches("Test-pass-123!",u.getPassword())).isTrue();assertThat(r.body()).doesNotContain("password","$2a$");}
 @Test void loginAndProfileUseExistingContract()throws Exception{var login=request("POST","/auth/login",null,Map.of("email",member.getEmail(),"password","Test-pass-123!"));assertThat(login.statusCode()).isEqualTo(200);var profile=request("GET","/users/me",body(login).get("token").asText(),null);assertThat(profile.statusCode()).isEqualTo(200);assertThat(body(profile).get("email").asText()).isEqualTo(member.getEmail());assertThat(profile.body()).doesNotContain("password");}
 @Test void invalidLoginAndValidationAreHandled()throws Exception{assertThat(request("POST","/auth/login",null,Map.of("email",member.getEmail(),"password","wrong")).statusCode()).isEqualTo(400);var r=request("POST","/auth/register",null,Map.of("name","","email","bad","password","x"));assertThat(r.statusCode()).isEqualTo(400);assertThat(body(r).has("errors")).isTrue();}
 @Test void memberRegistersCancelsAndReRegisters()throws Exception{var e=event(2);String path="/events/"+e.getId()+"/register";assertThat(request("POST",path,token,null).statusCode()).isEqualTo(201);assertThat(request("POST",path,token,null).statusCode()).isEqualTo(400);assertThat(request("GET","/events/my-registrations",token,null).body()).contains("Integration event");assertThat(request("DELETE",path,token,null).statusCode()).isEqualTo(204);assertThat(request("POST",path,token,null).statusCode()).isEqualTo(201);}
 @Test void registrationExceptionDoesNotPermitEventEditing()throws Exception{var e=event(3);for(String method:List.of("POST","PUT","DELETE")){String path=method.equals("POST")?"/events":"/events/"+e.getId();assertThat(request(method,path,token,method.equals("DELETE")?null:Map.of("title","Unauthorized")).statusCode()).isEqualTo(403);}assertThat(request("GET","/admin/events",token,null).statusCode()).isEqualTo(403);}
 @Test void privateRegistrationReadRequiresAuthentication()throws Exception{assertThat(request("GET","/events/my-registrations",null,null).statusCode()).isEqualTo(401);assertThat(request("GET","/tournaments/my-registrations",null,null).statusCode()).isEqualTo(401);}
 @Test void registrationOwnershipIsEnforced()throws Exception{var e=event(3);request("POST","/events/"+e.getId()+"/register",token,null);String other=jwt.generateToken(account(Role.MEMBER));assertThat(request("DELETE","/events/"+e.getId()+"/register",other,null).statusCode()).isEqualTo(400);assertThat(body(request("GET","/events/my-registrations",other,null)).size()).isZero();}
 @Test void lastPlaceCannotBeOversold()throws Exception{var e=event(1);String other=jwt.generateToken(account(Role.MEMBER));var executor=Executors.newFixedThreadPool(2);try{var tasks=List.<Callable<Integer>>of(()->request("POST","/events/"+e.getId()+"/register",token,null).statusCode(),()->request("POST","/events/"+e.getId()+"/register",other,null).statusCode());var results=executor.invokeAll(tasks);assertThat(List.of(results.get(0).get(),results.get(1).get())).containsExactlyInAnyOrder(201,400);}finally{executor.shutdownNow();}assertThat(body(request("GET","/events/"+e.getId()+"/availability",null,null)).get("remaining").asInt()).isZero();}
 @Test void completedEventsArePublicButDraftsAreNot()throws Exception{var e=event(3);e.setStatus(EventStatus.COMPLETED);events.save(e);assertThat(request("GET","/events/archive",null,null).body()).contains("Integration event");e.setStatus(EventStatus.DRAFT);events.save(e);assertThat(request("GET","/events/"+e.getId(),null,null).statusCode()).isEqualTo(404);}
 @Test void tournamentRegistrationAndCancellation()throws Exception{var t=tournaments.save(Tournament.builder().title("Integration tournament").game(game()).status(TournamentStatus.PUBLISHED).registrationOpen(true).maxTeams(2).build());String path="/tournaments/"+t.getId()+"/register";assertThat(request("POST",path,token,null).statusCode()).isEqualTo(201);assertThat(request("GET","/tournaments/my-registrations",token,null).body()).contains("Integration tournament");assertThat(request("DELETE",path,token,null).statusCode()).isEqualTo(204);}
 @Test void profileInterestsAndFavoritesPersist()throws Exception{assertThat(request("PUT","/users/me",token,Map.of("name","Updated","program","Computer Science","interests",List.of("Gaming"))).statusCode()).isEqualTo(200);assertThat(request("GET","/users/me",token,null).body()).contains("Computer Science","Gaming");var g=game();assertThat(request("PUT","/users/me/favorite-games/"+g.getId(),token,null).statusCode()).isEqualTo(204);assertThat(body(request("GET","/users/me/favorite-games",token,null)).size()).isEqualTo(1);assertThat(request("DELETE","/users/me/favorite-games/"+g.getId(),token,null).statusCode()).isEqualTo(204);}
 @Test void suggestionsBelongToAuthenticatedCreator()throws Exception{assertThat(request("POST","/suggestions",token,Map.of("name","Test idea","type","Gaming","authorId",admin.getId())).statusCode()).isEqualTo(201);assertThat(request("GET","/suggestions/mine",token,null).body()).contains("Test idea");assertThat(body(request("GET","/suggestions/mine",adminToken,null)).size()).isZero();}
 @Test void membershipApplicationPersistsInterestsAndAdminCanReview()throws Exception{var r=request("POST","/membership-applications",null,Map.of("firstName","Test","lastName","Applicant","email",UUID.randomUUID()+"@example.invalid","interests",List.of("Board Games")));assertThat(r.statusCode()).isEqualTo(201);assertThat(request("GET","/admin/membership-applications",adminToken,null).body()).contains("Board Games");assertThat(request("GET","/admin/membership-applications",token,null).statusCode()).isEqualTo(403);}
 @Test void adminCanManageContentAndSeeDrafts()throws Exception{var r=request("POST","/events",adminToken,Map.of("title","Admin draft","description","A test","eventDate",LocalDate.now().plusDays(3).toString()));assertThat(r.statusCode()).isEqualTo(201);assertThat(request("GET","/admin/events",adminToken,null).body()).contains("Admin draft");assertThat(request("GET","/events",null,null).body()).doesNotContain("Admin draft");var g=game();assertThat(request("PATCH","/admin/games/"+g.getId()+"/active",adminToken,Map.of("active",false)).statusCode()).isEqualTo(200);}
 @Test void disablingMemberInvalidatesExistingJwtAndLogin()throws Exception{assertThat(request("PATCH","/admin/users/"+member.getId()+"/enabled",adminToken,Map.of("enabled",false)).statusCode()).isEqualTo(204);assertThat(request("GET","/users/me",token,null).statusCode()).isEqualTo(401);assertThat(request("POST","/auth/login",null,Map.of("email",member.getEmail(),"password","Test-pass-123!")).statusCode()).isEqualTo(400);assertThat(request("PATCH","/admin/users/"+admin.getId()+"/enabled",adminToken,Map.of("enabled",false)).statusCode()).isEqualTo(400);}
 @Test void longImageUrlsAndDescriptionsPersist() throws Exception {
  String url="https://images.example.invalid/event.jpg?token="+"x".repeat(2500);
  String description="Long event description.\n".repeat(300);
  var response=request("POST","/events",adminToken,Map.of("title","Long content","description",description,"shortDescription","x".repeat(600),"eventDate",LocalDate.now().plusDays(4).toString(),"imageUrl",url));
  assertThat(response.statusCode()).isEqualTo(201);
  var saved=events.findById(body(response).get("id").asLong()).orElseThrow();
  assertThat(saved.getImageUrl()).isEqualTo(url);assertThat(saved.getDescription()).isEqualTo(description);
 }
 @Test void csvExportIsAdminOnlyAndExcludesCancelledParticipants() throws Exception {
  var e=event(5);member.setName("=SUM(1,2)\nTest \"quoted\"");member.setProgram("École, informatique");users.save(member);
  request("POST","/events/"+e.getId()+"/register",token,null);
  var cancelled=account(Role.MEMBER);String cancelledToken=jwt.generateToken(cancelled);
  request("POST","/events/"+e.getId()+"/register",cancelledToken,null);
  request("DELETE","/events/"+e.getId()+"/register",cancelledToken,null);
  String path="/admin/events/"+e.getId()+"/registrations.csv";
  assertThat(request("GET",path,null,null).statusCode()).isEqualTo(401);
  assertThat(request("GET",path,token,null).statusCode()).isEqualTo(403);
  var csv=request("GET",path,adminToken,null);
  assertThat(csv.statusCode()).isEqualTo(200);
  assertThat(csv.headers().firstValue("Content-Disposition").orElse("")).contains("attachment", ".csv");
  assertThat(csv.body()).startsWith("\uFEFFRegistration ID,").contains(member.getEmail(),"École, informatique","'=SUM(1,2)").doesNotContain(cancelled.getEmail());
 }
 @Test void visitorsCanSuggestWithoutReadingOrSpoofingMemberData() throws Exception {
  var response=request("POST","/suggestions",null,Map.of("name","Visitor game idea","type","Online Game","description","Please add this game","authorId",admin.getId()));
  assertThat(response.statusCode()).isEqualTo(201);
  long id=body(response).get("id").asLong();
  assertThat(jdbc.queryForObject("select author_id from suggestions where id=?",Long.class,id)).isNull();
  assertThat(body(response).get("status").asText()).isEqualTo("PENDING");
  assertThat(request("GET","/suggestions/mine",null,null).statusCode()).isEqualTo(401);
  assertThat(request("GET","/admin/suggestions",null,null).statusCode()).isEqualTo(401);
  assertThat(request("POST","/suggestions",null,Map.of("name","","type","")).statusCode()).isEqualTo(400);
  assertThat(request("GET","/admin/suggestions",adminToken,null).body()).contains("Visitor game idea");
 }
}
