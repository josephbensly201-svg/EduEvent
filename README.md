
# EduEvent - Plateforme de gestion d'événements universitaires

## Présentation
EduEvent est une plateforme web statique permettant à la communauté universitaire de consulter, rechercher et s'inscrire aux événements organisés sur le campus Henry Christophe de Limonade (CHCL).

## Technologies utilisées
- **HTML5** : Structure sémantique des pages
- **CSS3** : Design moderne, responsive, animations
- **JavaScript** : Interactions dynamiques, filtres, validation

## Structure du projet

EduEvent/
├── index.html
├── evenements.html
├── detail.html
├── profil.html
├── a-propos.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── evenement.js
│   ├── detail.js
│   ├── profil.js
│   └── a-propos.js 
├── data/
│   └── evenements.json
├── images/
│   ├── logo_CHCL.jpg
│   ├── chcl-image.jpg
│   ├── avatar-default.png
│   ├── Bensly.jpg
│   ├── wilkey.jpg
│   └── events/
│       ├── conference1.jpg
│       ├── reseaux.jpg
│       ├── foot1.jpg
│       ├── soiree.jpg
│       └── default.jpg
└── README.md


## Instructions d'installation
1. Téléchargez et extrayez le dossier `EduEvent`
2. Ouvrez le dossier avec Visual Studio Code
3. Lancez un serveur local (Live Server ou équivalent)
4. Ouvrez `index.html` dans votre navigateur

## Fonctionnalités principales

### 1. Page Accueil (index.html)
- En-tête avec logo, navigation et bouton de connexion
- Section héro avec image de fond
- Événements à la une (3 cartes)
- Statistiques animées (chargées depuis JSON)
- Newsletter avec validation

### 2. Liste des Événements (evenement.html)
- Barre de recherche en temps réel
- Filtres par catégorie
- Filtres par date (aujourd'hui, semaine, mois)
- Vue grille / liste
- Chargement progressif (Load More)
- Données chargées depuis `evenements.json`

### 3. Détail d'un Événement (detail.html)
- Bannière et informations complètes
- Compteur de places restantes
- Formulaire d'inscription avec validation
- Sauvegarde des inscriptions dans localStorage
- Section commentaires
- Partage sur les réseaux sociaux

### 4. Espace Étudiant (profil.html)
- Formulaire de connexion / inscription
- Profil utilisateur (nom, photo, faculté, niveau)
- Liste des inscriptions avec annulation
- Tableau de bord avec statistiques
- Paramètres de profil

### 5. À propos (a-propos.html)
- Présentation de la plateforme
- Équipe de développement
- Formulaire de contact avec validation
- Carte Google Maps
- FAQ accordéon

## Équipe
- **Bensly JOSEPH** : HTML, CSS, Design, Structure
- **Wilkenson TELFORT** : JavaScript, JSON,CSS, Interactions

## Planning réalisé
- Maquettes : 1ère semaine
- Intégration HTML/CSS : 2e-3e semaine
- JavaScript : 4e-5e semaine
- Tests et corrections : 5e semaine

## Licence
Projet réalisé dans le cadre du cours de Développement Web - Licence 3
Université d'État d'Haïti - Campus Henry Christophe de Limonade (UEH-CHCL)
Année académique : 2025-2026
