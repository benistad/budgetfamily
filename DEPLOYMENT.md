# Guide de Déploiement - Budget Familial

## Option 1 : Vercel (Recommandé) ⭐

### Prérequis
1. Compte GitHub (pour héberger le code)
2. Compte Vercel (gratuit) : https://vercel.com
3. Compte MongoDB Atlas (gratuit) : https://www.mongodb.com/cloud/atlas

### Étape 1 : Configurer MongoDB Atlas

✅ **Déjà fait !** Ton cluster MongoDB Atlas est configuré.

**Ta connection string** :
```
mongodb+srv://benoitdurand2:<db_password>@budgetfamily.4avomcb.mongodb.net/budget-family?retryWrites=true&w=majority&appName=BudgetFamily
```

⚠️ **Important** : Remplace `<db_password>` par ton vrai mot de passe MongoDB Atlas.

Si tu as oublié ton mot de passe :
1. Va sur MongoDB Atlas > Database Access
2. Clique sur "Edit" sur ton utilisateur `benoitdurand2`
3. Clique sur "Edit Password" pour le réinitialiser

### Étape 2 : Pousser le code sur GitHub

```bash
# Initialiser git si ce n'est pas déjà fait
git init
git add .
git commit -m "Initial commit"

# Créer un repo sur GitHub puis :
git remote add origin https://github.com/TON_USERNAME/budget-family.git
git branch -M main
git push -u origin main
```

### Étape 3 : Déployer sur Vercel

1. Va sur https://vercel.com et connecte-toi
2. Clique sur "New Project"
3. Importe ton repo GitHub `budget-family`
4. Dans "Environment Variables", ajoute :
   - **Name** : `MONGODB_URI`
   - **Value** : `mongodb+srv://benoitdurand2:TON_MOT_DE_PASSE@budgetfamily.4avomcb.mongodb.net/budget-family?retryWrites=true&w=majority&appName=BudgetFamily`
   - ⚠️ Remplace `TON_MOT_DE_PASSE` par ton vrai mot de passe
5. Clique sur "Deploy"

✅ Ton app sera disponible sur `https://budget-family.vercel.app` (ou un nom similaire)

---

## Option 2 : Netlify

Netlify ne supporte pas les API routes Next.js par défaut. Il faudrait utiliser Netlify Functions.

---

## Option 3 : Railway / Render

Ces plateformes supportent Next.js + MongoDB mais sont plus complexes à configurer.

---

## Variables d'environnement requises

Pour le déploiement, tu dois définir :

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/budget-family
```

⚠️ **Important** : Ne jamais commiter le fichier `.env.local` avec tes vraies credentials !

---

## Développement local

Crée un fichier `.env.local` à la racine :

```
MONGODB_URI=mongodb://localhost:27017/budget-family
```

Puis lance :
```bash
npm run dev
```
