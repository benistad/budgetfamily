# Migration vers Supabase - Guide Complet

## ✅ Ce qui a été fait

1. **Installation de @supabase/supabase-js** ✓
2. **Création du client Supabase** (`lib/supabase.ts`) ✓
3. **Création du schéma SQL** (`supabase-schema.sql`) ✓
4. **Migration de toutes les API routes** ✓
   - `/api/budget/[personne]` → Supabase
   - `/api/hellobank` → Supabase
   - `/api/sumeria` → Supabase
   - `/api/bred` → Supabase (avec sync auto des virements famille)

## 🚀 Étapes pour finaliser la migration

### 1. Créer les tables dans Supabase

1. Va sur ton projet Supabase : https://supabase.com/dashboard
2. Clique sur **SQL Editor** dans le menu de gauche
3. Copie tout le contenu du fichier `supabase-schema.sql`
4. Colle-le dans l'éditeur SQL
5. Clique sur **Run** pour exécuter le script
6. Vérifie que les 4 tables sont créées :
   - `budgets`
   - `hellobank`
   - `sumeria`
   - `bred`

### 2. Vérifier les variables d'environnement

Assure-toi que ton fichier `.env.local` contient :

```bash
SUPABASE_URL=https://ton-project-ref.supabase.co
SUPABASE_ANON_KEY=ton-anon-key
SUPABASE_SERVICE_ROLE_KEY=ton-service-role-key
```

**Où trouver ces valeurs ?**
1. Va sur ton projet Supabase
2. Clique sur **Settings** (icône engrenage) → **API**
3. Copie :
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role** (clic sur "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Tester la migration

Une fois les tables créées et les variables configurées :

```bash
# Arrêter le serveur actuel
pkill -f "next dev"

# Relancer le serveur
npm run dev
```

Puis ouvre http://localhost:3000 et teste :
- Page Benoit (`/benoit`)
- Page Marine (`/marine`)
- Page Hello Bank (`/hellobank`)
- Page Sumeria (`/sumeria`)
- Page BRED (`/bred`)

### 4. Vérifier les données dans Supabase

1. Va sur **Table Editor** dans Supabase
2. Vérifie que les données sont bien créées quand tu ajoutes des charges/revenus
3. Les tables `hellobank`, `sumeria` et `bred` doivent avoir une ligne par défaut

## 📊 Structure des tables

### Table `budgets`
```sql
- id (UUID, primary key)
- personne (VARCHAR, unique) : 'benoit' ou 'marine'
- charges (JSONB) : tableau des charges
- revenus (JSONB) : tableau des revenus
- virement_famille (DECIMAL) : montant du virement
- created_at, updated_at (TIMESTAMP)
```

### Table `hellobank`
```sql
- id (UUID, primary key)
- revenus (JSONB) : tableau des revenus
- depenses (JSONB) : tableau des dépenses
- created_at, updated_at (TIMESTAMP)
```

### Table `sumeria`
```sql
- id (UUID, primary key)
- depenses (JSONB) : tableau des dépenses
- created_at, updated_at (TIMESTAMP)
```

### Table `bred`
```sql
- id (UUID, primary key)
- revenus (JSONB) : tableau des revenus (incluant virements famille auto)
- depenses (JSONB) : tableau des dépenses
- created_at, updated_at (TIMESTAMP)
```

## 🔄 Différences avec MongoDB

### Avant (MongoDB)
- Champ : `virementFamille` (camelCase)
- Mongoose gère automatiquement `_id`, `__v`
- `updatedAt` géré par Mongoose

### Après (Supabase/PostgreSQL)
- Champ : `virement_famille` (snake_case)
- UUID généré automatiquement pour `id`
- `updated_at` géré par trigger SQL
- Pas de `__v` (versioning)

## 🗑️ Nettoyage (optionnel)

Une fois que tout fonctionne avec Supabase, tu peux supprimer :

```bash
# Fichiers MongoDB (à garder pour référence ou supprimer)
rm -rf lib/mongodb.ts
rm -rf models/
```

Et désinstaller les dépendances MongoDB :

```bash
npm uninstall mongoose mongodb
```

## 🚀 Déploiement sur Vercel

Avec Supabase, le déploiement est encore plus simple :

1. Pousse ton code sur GitHub
2. Sur Vercel, configure les 3 variables d'environnement Supabase
3. Déploie !

Pas besoin de MongoDB Atlas, tout est géré par Supabase.

## ⚠️ Important

- **Ne commite JAMAIS** le fichier `.env.local` (déjà dans `.gitignore`)
- Les clés `SERVICE_ROLE_KEY` sont sensibles, ne les partage jamais
- Pour la production sur Vercel, utilise les mêmes variables d'environnement

## 🆘 Troubleshooting

### Erreur : "relation budgets does not exist"
→ Tu n'as pas exécuté le script SQL dans Supabase

### Erreur : "Missing Supabase environment variables"
→ Vérifie que `.env.local` contient les 3 variables

### Erreur : "Invalid API key"
→ Vérifie que tu as bien copié les bonnes clés depuis Supabase Settings → API

### Les données ne s'affichent pas
→ Vérifie dans Supabase Table Editor que les tables ont bien été créées
