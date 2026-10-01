# Validation finale API réelle — 30 septembre 2026

- PostgreSQL : conteneur existant `pixel-dev-postgres-1`, sain, port 55433.
- Site principal : frontend 5173 → backend 8081 → base `pixel`.
- Recette avec écritures : même application sur 5175 → 8082 → `pixel_ui_qa`.
- Aucun conteneur tiers, volume ou donnée PostgreSQL supprimé. Aucun changement de design ou de contrat API.

## Résultats

- Suite Maven complète : **18 tests réussis**, 0 échec, 0 erreur, 0 ignoré.
  Dont **17 PixelIntegrationTest**, exécutés avec PostgreSQL Testcontainers.
- Migrations V1/V2 validées ; Hibernate en `validate`, nettoyage Flyway désactivé.
- Typecheck et build frontend réussis.
- Proxy principal : Games, Events et Tournaments répondent HTTP 200.
- Navigateur/API réelle QA : ADMIN connecté, lecture et sauvegarde d’événement ;
  inscription et connexion d’un nouveau MEMBER ; inscription et annulation
  Events/Tournaments après rechargement ; envoi de suggestion et candidature Join.
- PostgreSQL confirme le rôle MEMBER, l’auteur de la suggestion, le statut PENDING
  de la candidature, l’intérêt Board Games et les deux inscriptions CANCELLED.
- Permissions : MEMBER reçoit 403 sur admin/events, admin/membership-applications
  et admin/users ; visiteur reçoit 401 sur users/me.
- Après redémarrage du backend QA : connexion et suggestion relues avec succès,
  profil navigateur cohérent, aucune migration supplémentaire exécutée.
- Base principale : aucun utilisateur, candidature ou suggestion de test inséré.

## Correction de configuration

L’origine `http://localhost:5175` manquait dans le processus backend QA.
Définir `CORS_ALLOWED_ORIGINS=http://localhost:5175` pour ce processus a résolu
le refus des écritures de recette. Le site principal 5173 était déjà autorisé.
Aucune modification du code métier n’a été nécessaire.

## État de livraison

Validation locale fonctionnelle réussie. Les serveurs principaux restent sur
5173/8081 et PostgreSQL sur 55433. Les serveurs temporaires de recette sont arrêtés
après validation ; leurs données restent dans `pixel_ui_qa`.

La mise en production n’est pas validée par ces tests locaux : configurer et
vérifier l’hébergement, HTTPS/reverse proxy `/api`, origines et secrets de production,
et désigner le premier administrateur réel (la base principale ne contient aucun
compte). Discord reste désactivé tant que son invitation officielle manque.

Preuves : `backend-final-tests.log`, `qa-final-restart.log`,
`visual-qa/real-api-profile-final.png` (compte de recette, API réelle).
