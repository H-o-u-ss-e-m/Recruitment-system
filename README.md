# 💼 Portail de Recrutement Intégré (GroupRIF)

Bienvenue sur le portail de recrutement de **GroupRIF**. Ce projet est une application web complète (Full-Stack) conçue pour digitaliser et simplifier le processus de recrutement pour les candidats et les équipes de Ressources Humaines.

Le projet est divisé en deux parties indépendantes mais fortement intégrées :
1. **`front-recruitment-system`** : Une interface utilisateur moderne, réactive et interactive développée en React, TypeScript et Tailwind CSS.
2. **`back-recruitment-system`** : Une API REST robuste et sécurisée propulsée par Spring Boot (Java 25) avec persistance sous PostgreSQL et un service d'emailing automatique pour le suivi des candidatures.

---

## 🎨 Maquettes & Design Figma

L'expérience utilisateur et l'interface visuelle ont été soigneusement conçues et prototypées sur Figma avant l'intégration technique :

- **🎨 Maquette de l'Application** : [Design Figma - Système de Recrutement](https://www.figma.com/design/5Gljqc4pd8Vu2cXxyFXupC/system-recruement?node-id=0-1&t=R68mepSOUyQx2Bst-1)  
  *Cette maquette présente la charte graphique de GroupRIF, les composants d'interface, la palette de couleurs moderne (bleu professionnel et tons neutres), ainsi que la structure visuelle des pages clés (accueil, formulaires d'inscription en étapes, tableaux de bord).*
  
- **⚡ Prototype Interactif** : [Prototype Figma - Flux de Recrutement](https://www.figma.com/proto/5Gljqc4pd8Vu2cXxyFXupC/system-recruement?node-id=12-243&t=R68mepSOUyQx2Bst-1)  
  *Le prototype permet de simuler le parcours utilisateur réel : inscription en tant que candidat, filtrage et sélection des offres, soumission d'une candidature avec téléchargement de CV, et navigation dans le tableau de bord recruteur (gestion des statuts de candidature).*

---

## 📂 Structure du Workspace

```text
recruitment-system/
├── README.md                          # Ce fichier (documentation générale)
├── front-recruitment-system/          # Application Frontend (React/Vite/TS)
│   ├── src/                           # Code source (composants, pages, styles)
│   ├── server.ts                      # Serveur de développement avec API Mock intégrée
│   ├── package.json                   # Dépendances Node.js et scripts de lancement
│   └── vite.config.ts                 # Configuration du bundler Vite
└── back-recruitment-system/           # API Backend (Spring Boot/Maven)
    ├── src/main/java/                 # Code source Java (Controllers, Services, Modèles, DTOs)
    ├── src/main/resources/            # Configuration Spring (application.yaml, templates d'emails)
    ├── pom.xml                        # Fichier de build Maven et dépendances
    └── mvnw / mvnw.cmd                # Wrapper Maven pour le démarrage
```

---

## 📊 Diagramme de Classes & Base de Données

<img width="1536" height="1024" alt="Diagramme de Classes" src="https://github.com/user-attachments/assets/a3bd1709-3110-4d7b-b731-f9ffba581522" />

### Relations et Règles de Cardinalité :
1. **Candidat & Candidature (1 to 0..\*)** : Un `Candidate` peut soumettre zéro ou plusieurs candidatures (`Application`), mais chaque candidature est liée à un unique candidat.
2. **Offre d'emploi & Candidature (1 to 0..\*)** : Une offre d'emploi (`JobOffer`) peut recevoir plusieurs candidatures (`Application`), mais chaque candidature concerne une unique offre d'emploi.
3. **Recruteur & Offre d'emploi (1 to 0..\*)** : Un `Recruiter` peut publier plusieurs offres d'emploi (`JobOffer`), mais chaque offre est créée et supervisée par un unique recruteur.
4. **Statuts Applicatifs (Enums)** :
   - `ApplicationStatus` définit l'état d'avancement d'une candidature (`EN_ATTENTE`, `EN_COURS`, `ACCEPTE`, `REFUSE`).
   - `JobStatus` détermine si l'offre d'emploi est actuellement active (`OPEN`) ou clôturée (`CLOSED`).

---

## 🛠️ Technologies & Outils

### Frontend
- **Framework Core** : React 19 & TypeScript
- **Bundler / Compilateur** : Vite 6 & Esbuild
- **Styling** : Tailwind CSS v4 (Design moderne, fluide et adaptatif)
- **Icônes & Animations** : Lucide React & Motion (ex-Framer Motion)
- **Gestionnaire de fichiers** : Multer & Express (côté serveur local mock)

### Backend
- **Framework Core** : Spring Boot 3.5.16
- **Version Java** : Java 25
- **Persistance** : Spring Data JPA / Hibernate
- **Base de données** : PostgreSQL 17+
- **Gestion des Dépendances** : Maven
- **Messagerie** : Spring Mail (Java Mail Sender pour les notifications)
- **Validation** : Hibernate Validator (Jakarta Validation)

---

## 🚀 Fonctionnalités Principales

### 🧑‍💻 Espace Candidat
- **Consultation des Offres** : Recherche, tri et filtrage dynamique des opportunités d'emploi publiées.
- **Création de Compte & Profil** : Enregistrement complet avec informations personnelles, niveau d'études, université, spécialité, liens (GitHub, LinkedIn, Portfolio) et description.
- **Candidature en 3 étapes** :
  1. *Informations Personnelles* (Préremplies si connecté).
  2. *Parcours & Compétences* (Ajout dynamique de tags de compétences et langues maîtrisées).
  3. *Motivation & Dépôt de CV* (Téléversement obligatoire de CV en PDF et rédaction d'une lettre de motivation).
- **Suivi en temps réel** : Tableau de bord listant les candidatures et leur statut actuel.

### 🏢 Espace Recruteur (RH)
- **Tableau de Bord Analytique** : Statistiques globales (nombre d'offres actives, candidatures reçues, réparties par statut).
- **Gestion des Offres** : Création, modification et fermeture d'offres d'emploi.
- **Gestion des Candidatures** :
  - Visualisation détaillée du dossier d'un candidat.
  - **Visualiseur PDF intégré** pour lire le CV directement dans l'application sans téléchargement forcé.
  - Changement de statut avec boîte de dialogue de confirmation (`En attente`, `En cours d'étude`, `Acceptée`, `Refusée`).
  - **Envoi automatique d'emails formatés** informant le candidat du changement de statut de sa candidature.

---

## 📧 Notifications & Système d'Emailing Automatique

Le système intègre un mécanisme d'envoi d'emails automatique asynchrone géré par le backend Spring Boot pour tenir le candidat informé de l'évolution de son dossier en temps réel.

### ⚙️ Fonctionnement des Emails
1. **Dépôt de la Candidature** : Dès que le candidat valide la soumission de son dossier avec son CV en format PDF, un premier email de confirmation lui est envoyé automatiquement pour accuser réception de sa postulation.
2. **Mise à jour du Statut par le Recruteur** : Depuis le tableau de bord RH, lorsque le recruteur modifie le statut d'une candidature (`En cours d'étude`, `Acceptée` ou `Refusée`), un email HTML personnalisé et stylisé est envoyé instantanément à l'adresse du candidat.
3. **Mise en Page Responsive & Moderne** : Les emails générés utilisent un gabarit HTML moderne reprenant les couleurs professionnelles de GroupRIF, mentionnant explicitement le prénom du candidat, le titre du poste visé, le nouveau statut attribué, ainsi qu'un message explicatif adapté.

### 📸 Aperçu de l'Email de Notification de Statut
*Ci-dessous, un aperçu visuel d'un email de notification automatique reçu par un candidat (ici, lors du passage de son dossier au statut "En cours d'étude") :*

<img width="803" height="497" alt="Capture d&#39;écran 2026-07-02 103305" src="https://github.com/user-attachments/assets/a2a430b0-e088-4175-bcbf-fc7f8b166343" />


---

## 🔒 Sécurité et Contrôle des Saisies (Form Validation)

Le projet intègre une approche de sécurité de bout en bout (**Defense in Depth**), assurant la validation des données sur le client et sur le serveur pour prévenir les comportements inattendus ou malveillants.

### 1. Contrôle des Saisies (Validation)

#### 🖥️ Côté Frontend (React / TypeScript)
- **Validation à la Saisie (HTML5)** : Utilisation des types natifs (`type="email"`, `type="tel"`, `type="date"`, `required`) pour contraindre les saisies de l'utilisateur directement dans le navigateur.
- **Validation Logique Métier** :
  - Vérification de la présence de tous les champs obligatoires avant envoi.
  - Contrôle de la correspondance des mots de passe lors de la création de compte.
  - Acceptation obligatoire des conditions générales d'utilisation.
- **Contrôle des Fichiers (CV)** :
  - Limitation stricte du format : **uniquement les fichiers PDF** (`file.type === "application/pdf"`) sont acceptés.
  - Limitation stricte de la taille : rejet immédiat si le fichier dépasse **5 Mo** afin de préserver la bande passante et le serveur.
- **Retours Utilisateur** : Notification immédiate des erreurs de saisie grâce au module `<Toast />`.

#### ⚙️ Côté Backend (Spring Boot Validation)
Le backend n'accorde jamais de confiance implicite aux requêtes du client et applique une validation stricte sur les DTOs grâce à Jakarta Validation (`spring-boot-starter-validation`) :
- **Identification des Champs** : Validation systématique avec la directive `@Valid` dans les controllers (`AuthController`, `CandidateController`, `ApplicationController`).
- **Annotations de Validation appliquées** :
  - `@NotBlank` : Garantit que les champs essentiels (noms, prénoms, emails, mots de passe) ne soient pas vides ou composés uniquement d'espaces.
  - `@Email` : Valide la conformité syntaxique des adresses email reçues.
  - `@Size` : Restreint la longueur maximale de tous les champs textuels (ex: max 120 caractères pour le mot de passe, max 4000 pour la lettre de motivation) pour éviter les attaques par saturation de mémoire (Buffer Overflow) ou les plantages d'insertion en base de données.
  - `@Positive` : Enforce des valeurs strictement positives pour le salaire attendu (`expectedSalary`) et l'identifiant des offres (`jobOfferId`).

---

### 2. Mesures de Sécurité Avancées

#### 📁 Protection contre les Téléversements Malveillants (CV Upload)
Le téléversement de fichiers est une vulnérabilité critique courante. Les garde-fous suivants ont été programmés :
- **Renommage Dynamique et Anonymisation** : Le nom d'origine du fichier fourni par le client est jeté. Le système génère automatiquement un nom unique basé sur l'adresse email du candidat et l'horodatage système :  
  `String filename = email.replace("@", "_") + "_" + System.currentTimeMillis() + ".pdf";`
- **Forçage d'Extension** : L'extension est forcée à `.pdf`. Même si un attaquant parvient à injecter un script malveillant (ex: `.jsp`, `.php`, `.exe`), le fichier sera enregistré comme un document PDF inoffensif sur le disque.
- **Prévention du Path Traversal** : Lors du téléchargement ou de l'affichage du CV par les recruteurs, le contrôleur vérifie que le chemin final résolu se situe strictement à l'intérieur du dossier autorisé (`uploads/cvs`) en validant le chemin normalisé :  
  `if (!file.startsWith(cvRoot) || !Files.exists(file)) { return ResponseEntity.notFound().build(); }`

#### 🍪 Sécurité des Sessions et Cookies
L'authentification s'appuie sur des sessions HTTP sécurisées gérées par le serveur (`HttpSession`) :
- **HttpOnly Cookie** : Le cookie de session `JSESSIONID` est configuré avec l'attribut `http-only: true`. Cela empêche l'accès au cookie par des scripts JavaScript côté client, neutralisant les risques de vol de session via une faille XSS.
- **SameSite Protection** : La directive `same-site: lax` est configurée pour prémunir l'application contre les attaques de type CSRF (Cross-Site Request Forgery).
- **Session Timeout** : Les sessions expirent automatiquement après 30 minutes d'inactivité.

#### 🛡️ Protection CORS (Cross-Origin Resource Sharing)
Le backend Spring Boot n'accepte pas les requêtes de serveurs arbitraires. Les politiques CORS limitent les requêtes uniquement aux adresses de développement fiables :
- `@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")`
- L'option `allowCredentials = "true"` assure l'échange sécurisé de cookies de session entre le client React (port 3000) et l'API Spring Boot (port 8080).

---

## ⚙️ Guide de Démarrage Rapide

### 📋 Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- [Java Development Kit (JDK)](https://adoptium.net/) (version 25 requis par le projet)
- [PostgreSQL](https://www.postgresql.org/) installé et en cours d'exécution.

---

### 💻 Option A : Lancement Complet (Full-Stack avec Base de Données)

C'est le mode nominal qui utilise la base de données PostgreSQL et gère l'envoi d'emails.

#### 1. Configuration de la Base de données (PostgreSQL)
Créez une base de données PostgreSQL nommée `recruitment-system`. Par défaut, le fichier `application.yaml` du backend s'attend aux identifiants suivants :
- **URL** : `jdbc:postgresql://localhost:5432/recruitment-system`
- **Username** : `postgres`
- **Password** : `system`

*Note : Vous pouvez ajuster ces configurations dans [application.yaml](file:///c:/Users/rezgu/Desktop/recruitment-system/back-recruitment-system/src/main/resources/application.yaml).*

#### 2. Démarrer le Backend Spring Boot
Dans un terminal, placez-vous dans le dossier backend et lancez l'application :
```powershell
cd back-recruitment-system
./mvnw spring-boot:run
```
Le serveur démarre sur le port `8080`. Hibernate créera automatiquement les tables de la base de données à votre premier lancement (`ddl-auto: update`).

#### 3. Démarrer le Frontend React
Ouvrez un second terminal, placez-vous dans le dossier frontend, installez les dépendances et démarrez le serveur :
```powershell
cd front-recruitment-system
npm install
npm run dev
```
Le frontend démarre sur `http://localhost:3000`. L'interface détectera automatiquement le backend actif sur le port 8080.

---

### 📦 Option B : Lancement Rapide (Mode Mock autonome)

Si vous ne possédez pas PostgreSQL ou souhaitez tester rapidement l'interface sans démarrer le serveur Java, le projet inclut un serveur mock Express en TypeScript dans le frontend.

1. Allez dans le dossier frontend :
   ```powershell
   cd front-recruitment-system
   npm install
   ```
2. Démarrez l'application :
   ```powershell
   npm run dev
   ```
Ce script lance `server.ts` sur le port `3000`. Il héberge à la fois les fichiers de l'application React et fournit une API de simulation en mémoire qui implémente les mêmes routes que le backend Spring Boot (connexion, inscription, publication d'offres et dépôt de candidatures).

---

## 📧 Configuration des Notifications Email

L'application envoie des alertes par email lors du dépôt d'une candidature ou de la modification de son statut par le recruteur.  
L'expéditeur configuré par défaut est `rezguihoussem67@gmail.com`.

Pour modifier les identifiants d'envoi ou adapter le serveur de messagerie, modifiez les propriétés suivantes dans le fichier `application.yaml` du backend ou configurez des variables d'environnement correspondantes :
- `spring.mail.host` (ex: smtp.gmail.com)
- `spring.mail.username` (votre adresse email d'envoi)
- `spring.mail.password` (le mot de passe d'application ou de compte)

---
*Développé dans le cadre du projet de recrutement GroupRIF.*
