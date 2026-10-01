# Recette visuelle FIGMA — 30 septembre 2026

Mise à jour : le blocage Docker signalé ci-dessous est levé. La reprise des tests
et des parcours avec PostgreSQL réel est documentée dans `FINAL-API-VALIDATION.md`.
Les résultats visuels de ce document restent ceux de la session initiale.

## Périmètre vérifié

Home, About, Games, Events, Tournaments, Gallery, Team, Suggest Activity,
Join Pixel, Discord / Community, Student Profile et Admin comparés à
l’export approuvé conservé dans `references/figma`.

Les 12 pages ont été capturées aux largeurs 390, 768, 1024 et 1440 px.
Les 48 contrôles DOM n’ont détecté aucun débordement horizontal, image
cassée ou titre/bouton tronqué dans les scénarios testés. Les quatre pages
affectées par les dernières retouches ont été recontrôlées aux quatre largeurs.

## Corrections réalisées

- Rétablissement des bordures au survol des cartes, auparavant masquées par un style inline.
- États compacts du profil pour retrouver le rythme visuel du prototype.
- Ratios des images de galerie, couleurs décoratives des avatars et ajustements mobiles de l’équipe.
- Navigation mobile défilable, fermeture par Échap et restauration du défilement.
- Fenêtres défilables, boutons de fermeture et cibles tactiles mobiles agrandis.
- États vides Events/Tournaments avec les appels à contribution existants.
- Liens des cartes Home, activation clavier des vignettes et clés React fondées sur les identifiants.
- Retrait d’une date de création du club non confirmée sur About.

Logo officiel, gradients, typographie et contrats API conservés. Aucun changement
backend pendant cette recette. Aucune nouvelle fonctionnalité métier.

## Validation et limites

- `npm run typecheck` : réussi.
- `npm run build` : réussi (Vite 8.3.1).
- Aucun script de tests frontend automatisés n’est présent dans le projet.
- Contrôles navigateur : états chargement/vide/erreur, succès des formulaires
  Join/Suggestions, profil, navigation mobile, survol des cartes, fenêtres Games/Gallery/Admin.
- Discord : bouton désactivé et aucune invitation inventée.
- `PixelIntegrationTest` : lancement tenté, échec avant exécution fonctionnelle,
  Testcontainers ne trouve pas de moteur Docker valide. Les résultats backend
  de la phase précédente ne constituent pas une validation de cette session.

Docker/PostgreSQL étant indisponibles, les états de données ont été contrôlés
sur un serveur de fixtures local isolé (port 18082, frontend 5176). Ces fixtures
ne sont ni importées par l’application ni insérées dans PostgreSQL. Ces contrôles
valident le rendu et les interactions frontend, pas la persistance réelle.
Le site principal garde sa connexion API habituelle ; il affiche ses erreurs
réelles lorsque le backend est indisponible.

## Différences Figma restantes

Les statistiques, badges, historiques et contenus de démonstration ne sont pas
réintroduits. Les photos et volumes de contenu dépendent des données réelles.
Discord conserve un état honnête sans invitation. Admin reflète les fonctions
réelles et son menu mobile adapté ; la lightbox et les formulaires utilisent
les fenêtres accessibles intégrées. La page Team conserve son appel à rejoindre
le club sous la grille. Ces différences empêchent de revendiquer une reproduction
pixel à pixel du prototype rempli de données fictives.

La recette visuelle est effectuée ; la validation complète avec API réelle et
les tests backend restent à reprendre après rétablissement de Docker.

Preuves locales : `visual-qa/metrics.json`, `final-recheck.json`, `states.json`,
captures comparatives et journal `backend-tests.log`.
