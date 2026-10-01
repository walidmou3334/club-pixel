# PIXEL

Frontend React/TypeScript/Tailwind basé sur l'implémentation Figma approuvée, connecté au backend Spring Boot et à PostgreSQL. Le logo dans `frontend/public/pixel-logo.png` est le fichier officiel fourni par le propriétaire.

## Démarrage local

1. Copier `.env.example` vers `.env` si absent, puis renseigner les secrets locaux (ne pas écraser le fichier existant).
2. `docker compose up -d --wait` : PostgreSQL écoute sur `127.0.0.1:55433`, base `pixel`, volume persistant.
3. Charger les variables de `.env` dans le processus Java. Dans `backend`, lancer `mvn spring-boot:run` avec Java 17 ou supérieur. Le backend écoute sur 8081.
4. Dans `frontend`, lancer `npm ci`, puis `npm run dev`. Ouvrir http://localhost:5173.

Le dépôt contient `package-lock.json` pour reproduire l'installation npm validée. L'ancien verrou pnpm est conservé comme référence de l'export Figma ; utiliser npm pour cette version.

## Configuration

- Backend : `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `SERVER_PORT`.
- `CORS_ALLOWED_ORIGINS` : liste d'origines explicites séparées par des virgules. Par défaut : localhost 8443 HTTPS, 5173 et 3000 HTTP. Aucun joker.
- Frontend : copier `frontend/.env.example` vers `frontend/.env`. `VITE_API_URL=/api` utilise le proxy local vers 8081. En production, servir `/api` via le reverse proxy ou fournir l'URL publique de l'API et son origine CORS.
- `DISCORD_INVITE_URL` : invitation officielle uniquement. Vide = bouton désactivé. Redémarrer Vite ou reconstruire le frontend après modification.
- `API_PROXY_TARGET` permet de cibler un backend de validation séparé ; `PORT` permet de démarrer un frontend QA sur un autre port.

## Données et accès

Aucun contenu de démonstration ni administrateur avec mot de passe par défaut n'est injecté. Une inscription publique crée uniquement un MEMBER. La promotion du premier administrateur doit être effectuée explicitement par le responsable de la base sur le compte réel choisi.

Flyway applique V1 (schéma initial), V2 (profils, intérêts, favoris, auteur des suggestions, activation des comptes, catégories galerie) et V3 (URL d’images et descriptions longues). Hibernate valide le schéma sans le créer. Le nettoyage Flyway et le baseline automatique sont désactivés. Pour une base préexistante, vérifier et sauvegarder son schéma avant toute adoption de Flyway ; ne pas exécuter aveuglément V1 dessus.

Les annulations conservent les inscriptions et les activités. Les contenus fictifs (XP, badges, statistiques Discord, sponsors, fausses annonces/historiques) ne sont pas alimentés. Les tournois V1 proposent des inscriptions individuelles, sans moteur de bracket.

## Validation

- `npm run typecheck` puis `npm run build` dans `frontend`.
- `mvn test` dans `backend`, avec Docker accessible : les deux classes de test utilisent chacune PostgreSQL Testcontainers, sans toucher à `pixel`.
- Les tests couvrent notamment les droits MEMBER/ADMIN, JWT invalide ou compte désactivé, concurrence sur la dernière place, annulation/réinscription, confidentialité, profils, intérêts, favoris, candidatures et migrations idempotentes.

La base `pixel_ui_qa` et les ports 8082/5175, lorsqu'utilisés, sont exclusivement réservés aux données de test navigateur. Ils ne sont pas le site principal.

## Dépôt et données locales

À la demande explicite du propriétaire, les fichiers `.env` et `frontend/.env` sont versionnés en clair dans ce dépôt privé. Les identifiants du fichier `.env.admin-local`, journaux, dépendances et résultats de validation restent exclus. Ne pas rendre ce dépôt public.

Les images officielles sont incluses dans `frontend/public`. Une sauvegarde PostgreSQL datée du 30 septembre 2026 est disponible dans `backups/`. Elle contient le schéma et les données au moment de l’export. Cloner le dépôt ne restaure pas automatiquement PostgreSQL : suivre `backups/README.md`. Les changements futurs de la base ne sont pas synchronisés par Git.
