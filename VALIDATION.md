# Reprise du 30 septembre 2026

Reprise des modifications existantes, sans nouvel audit ni réécriture du projet.

## Résultats vérifiés

- Frontend : TypeScript et build Vite réussis.
- Backend : 18 tests réussis, zéro échec/erreur/ignoré. Après la modification CORS, les 17 tests d'intégration ont été relancés avec succès.
- Packaging JAR réussi après libération du verrou Windows de l'ancien processus.
- Flyway : création des deux migrations sur PostgreSQL temporaire, validation puis nouvelle exécution sans migration supplémentaire.
- Navigateur QA : connexion MEMBER, inscription et annulation d'événement avec capacité actualisée ; connexion ADMIN, création d'un jeu ; candidature Join retrouvée dans Admin avec l'intérêt Board Games.
- CORS QA : origine autorisée = 200 ; origine inconnue = 403.
- Dix pages publiques et liste Admin Games : aucun débordement horizontal détecté à 390, 768, 1024 et 1440 px.
- Join : dimensions des champs, titres, boutons, tailles de police et rayons identiques à la référence Figma à largeur égale. Contrôle visuel Join mobile/desktop et Discord mobile effectué.
- Bouton Discord externe désactivé sans invitation ; aucun faux lien ajouté.
- Logo PNG copié à l'identique (empreinte SHA-256 identique à la source propriétaire).
- Aucun message console d'erreur dans le parcours navigateur QA final.

## Corrections de reprise

Import du port dans les tests, fermeture de l'exécuteur compatible Java 17, isolation PostgreSQL du test contextLoads, chargement `.env` Vite, séparation des caches Vite, origines CORS configurables, suppression de l'état vide permanent sous les événements, retrait de l'année de fondation fictive, titre de page PIXEL et intégration du logo officiel.

## Limites de cette validation

Les mesures responsive ne constituent pas une comparaison visuelle exhaustive de chaque état de chaque page. Les écrans privés peuplés, les interactions avancées et les médias définitifs nécessitent encore cette recette. Aucun déploiement de production ni migration de base préexistante n'a été réalisé. Le lien Discord officiel et les contenus réels du club restent à fournir.

Les fixtures navigateur sont uniquement dans `pixel_ui_qa`. Le site principal utilise `pixel`. Les serveurs QA et référence sont temporaires ; les commandes normales sont décrites dans README.md.
