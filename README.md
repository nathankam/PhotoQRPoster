# PhotoPoster 📸

Une application web Next.js pour partager des images avec vos amis, déployable facilement sur Vercel.

## 🚀 Fonctionnalités

- **Gestion d'utilisateurs** : Chaque ami a un UUID unique et un mot de passe personnel
- **Création d'utilisateurs** : Interface admin `/create` pour créer de nouveaux utilisateurs
- **Feed d'images** : Page publique `/[uuid]` pour voir les images d'un ami
- **Interface utilisateur** : Page protégée `/admin/[uuid]` pour uploader des images (mot de passe utilisateur)
- **Notifications automatiques** : Envoi d'emails via Resend quand une nouvelle image est ajoutée
- **Stockage cloud** : Images stockées sur Vercel Blob Storage
- **Base de données** : SQLite pour la persistance des données
- **Design responsive** : Interface mobile-first avec TailwindCSS

## 🛠️ Stack technique

- **Frontend** : Next.js 14 (App Router)
- **Base de données** : SQLite
- **Stockage** : Vercel Blob Storage
- **Emails** : Resend API
- **Styling** : TailwindCSS
- **Déploiement** : Vercel

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Vercel
- Compte Resend
- Vercel Blob Storage configuré

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone <votre-repo>
   cd PhotoPoster
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   # Pour le développement local
   cp env.local.example .env.local
   
   # Pour la production (Vercel)
   cp env.example .env
   ```
   
   Remplir `.env.local` avec vos vraies valeurs :
   ```env
   ADMIN_PASSWORD=votre_mot_de_passe_admin
   RESEND_API_KEY=votre_cle_api_resend
   BLOB_READ_WRITE_TOKEN=votre_token_vercel_blob
   REDIS_URL=votre_url_redis
   ```

4. **Initialiser la base de données (développement local)**
   ```bash
   # Pour SQLite (développement local uniquement)
   npm run db:seed
   
   # Pour Vercel KV (production)
   npm run kv:seed
   ```
   
   Cela créera des utilisateurs fictifs et affichera leurs UUIDs.

5. **Lancer en développement**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Variables d'environnement

#### Développement local (`.env.local`)
```bash
cp env.local.example .env.local
# Remplir avec vos vraies valeurs
```

#### Production (Vercel)
```bash
cp env.example .env
# Configurer dans Vercel Dashboard → Settings → Environment Variables
```

### Vercel Blob Storage

1. Créer un projet sur [Vercel](https://vercel.com)
2. Aller dans Storage → Blob
3. Créer un store et récupérer le token `BLOB_READ_WRITE_TOKEN`

### Base de données SQLite

La base de données SQLite est créée automatiquement dans le dossier `data/` lors de la première utilisation.

### Resend

1. Créer un compte sur [Resend](https://resend.com)
2. Générer une API key
3. Configurer le domaine d'envoi (optionnel)

## 📱 Utilisation

### Voir les images d'un ami
- Accéder à `/[uuid]` où `[uuid]` est l'UUID de l'ami
- Les images s'affichent en colonne, mobile-first

### Créer un nouvel utilisateur
- Aller sur `/create`
- Saisir le mot de passe administrateur global
- Remplir l'email et le mot de passe du nouvel utilisateur
- L'UUID sera généré automatiquement

### Uploader une image pour un ami
- Aller sur `/admin/[uuid]`
- Saisir le mot de passe de l'utilisateur (pas le mot de passe admin)
- Sélectionner et uploader une image
- L'ami recevra automatiquement un email

## 🗄️ Structure de la base de données

### Table `users`
- `uuid` (TEXT, PRIMARY KEY) : Identifiant unique de l'utilisateur
- `email` (TEXT, NOT NULL) : Email de l'utilisateur
- `password` (TEXT, NOT NULL) : Mot de passe de l'utilisateur

### Table `images`
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT) : Identifiant de l'image
- `user_uuid` (TEXT, NOT NULL) : UUID de l'utilisateur propriétaire
- `url` (TEXT, NOT NULL) : URL de l'image sur Vercel Blob
- `created_at` (TIMESTAMP) : Date de création

## 📁 Structure du projet

```
PhotoPoster/
├── app/                    # App Router Next.js
│   ├── [uuid]/           # Page publique des images
│   ├── admin/[uuid]/     # Page admin d'upload
│   ├── api/              # API routes
│   │   ├── auth/         # Authentification admin
│   │   └── upload/[uuid]/ # Upload d'images
│   ├── globals.css       # Styles TailwindCSS
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Page d'accueil
├── lib/                   # Utilitaires
│   ├── db.ts            # Connexion et fonctions SQLite
│   ├── blob.ts          # Upload Vercel Blob
│   └── email.ts         # Envoi d'emails Resend
├── scripts/              # Scripts utilitaires
│   └── seed.ts          # Seed de la base de données
├── data/                 # Base de données SQLite
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🚀 Déploiement sur Vercel

1. **Pousser sur GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connecter à Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Importer votre repo GitHub
   - Configurer les variables d'environnement
   - Déployer !

3. **Variables d'environnement sur Vercel**
   - `ADMIN_PASSWORD`
   - `RESEND_API_KEY`
   - `BLOB_READ_WRITE_TOKEN`

## 🔒 Sécurité

- L'interface de création d'utilisateurs est protégée par le mot de passe administrateur global
- Chaque utilisateur a son propre mot de passe pour accéder à son interface d'upload
- Validation des types de fichiers (images uniquement)
- Limitation de taille des fichiers (10MB max)
- UUIDs uniques pour chaque utilisateur
- Mots de passe utilisateur minimum 6 caractères

## 🚨 Gestion des erreurs

- **Page 404** : Utilisateur non trouvé avec liens de navigation
- **Page d'erreur admin** : Interface admin non trouvée
- **Page d'erreur upload** : Route d'upload non trouvée
- **Page d'erreur globale** : Gestion des erreurs 500 et critiques
- **Messages d'erreur API** : Réponses JSON détaillées avec codes d'erreur

## 🐛 Dépannage

### Erreur de base de données
- Vérifier que le dossier `data/` existe
- Relancer `npm run db:seed`

### Erreur d'upload
- Vérifier `BLOB_READ_WRITE_TOKEN`
- Vérifier la taille et le type de fichier

### Erreur d'email
- Vérifier `RESEND_API_KEY`
- Vérifier la configuration du domaine sur Resend

## 📝 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request. 