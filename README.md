# Budget Familial

Application web de gestion du budget prévisionnel familial, optimisée pour mobile et accessible sur desktop.

## Fonctionnalités

### Étape 1 (Actuelle)
- **Pages individuelles** : Une page pour Benoit et une pour Marine
- **Gestion des charges** : Ajout et suppression de charges personnelles
- **Gestion des revenus** : Ajout et suppression de revenus
- **Virement famille** : Montant du virement mensuel vers le compte commun
- **Calcul automatique** : Solde calculé automatiquement (Revenus - Charges - Virement Famille)
- **Stockage persistant** : Données sauvegardées dans Supabase

## Technologies utilisées

- **Frontend** : Next.js 14, React, TypeScript
- **Styling** : TailwindCSS
- **Icons** : Lucide React
- **Backend** : Next.js API Routes
- **Base de données** : Supabase (PostgreSQL)

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer Supabase :
   - Crée un compte sur https://supabase.com
   - Crée un nouveau projet
   - Exécute le script SQL dans `supabase-schema.sql` (SQL Editor)
   - Récupère tes clés API (Settings → API)

3. Configurer les variables d'environnement :
Crée un fichier `.env.local` avec :
```
SUPABASE_URL=https://ton-project-ref.supabase.co
SUPABASE_ANON_KEY=ton-anon-key
SUPABASE_SERVICE_ROLE_KEY=ton-service-role-key
```

4. Lancer l'application en mode développement :
```bash
npm run dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Structure du projet

```
budget-family/
├── app/
│   ├── api/
│   │   └── budget/
│   │       └── [personne]/
│   │           └── route.ts       # API pour gérer les budgets
│   ├── benoit/
│   │   └── page.tsx               # Page de Benoit
│   ├── marine/
│   │   └── page.tsx               # Page de Marine
│   ├── layout.tsx                 # Layout principal
│   ├── page.tsx                   # Page d'accueil
│   └── globals.css                # Styles globaux
├── components/
│   └── BudgetPage.tsx             # Composant principal de gestion du budget
├── lib/
│   └── supabase.ts                # Configuration Supabase
├── supabase-schema.sql            # Schéma SQL des tables
└── package.json
```

## Utilisation

1. Sur la page d'accueil, choisir entre le budget de Benoit ou Marine
2. Sur la page de budget :
   - **Ajouter un revenu** : Entrer le nom et le montant, puis cliquer sur +
   - **Ajouter une charge** : Entrer le nom et le montant, puis cliquer sur +
   - **Définir le virement famille** : Modifier le montant dans la section Famille
   - **Supprimer un élément** : Cliquer sur l'icône de corbeille
3. Le solde se calcule automatiquement : Revenus - Charges - Virement Famille
4. Toutes les modifications sont sauvegardées automatiquement dans la base de données

## Déploiement en ligne

Pour déployer cette application en production sur Vercel :

**Résumé rapide** :
1. Pousser le code sur GitHub
2. Déployer sur Vercel (gratuit)
3. Configurer les 3 variables d'environnement Supabase :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

Consulte **[SUPABASE-MIGRATION.md](./SUPABASE-MIGRATION.md)** pour plus de détails.

## Prochaines étapes

Les fonctionnalités suivantes seront ajoutées dans les prochaines étapes selon vos instructions.
