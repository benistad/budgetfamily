#!/bin/bash

echo "🔍 Vérification du projet avant déploiement..."
echo ""

# Vérifier que les fichiers nécessaires existent
echo "✅ Fichiers de configuration :"
[ -f "package.json" ] && echo "  ✓ package.json" || echo "  ✗ package.json manquant"
[ -f "tsconfig.json" ] && echo "  ✓ tsconfig.json" || echo "  ✗ tsconfig.json manquant"
[ -f ".gitignore" ] && echo "  ✓ .gitignore" || echo "  ✗ .gitignore manquant"
[ -f ".env.example" ] && echo "  ✓ .env.example" || echo "  ✗ .env.example manquant"

echo ""
echo "✅ Fichiers de déploiement :"
[ -f "vercel.json" ] && echo "  ✓ vercel.json" || echo "  ✗ vercel.json manquant"
[ -f "DEPLOYMENT.md" ] && echo "  ✓ DEPLOYMENT.md" || echo "  ✗ DEPLOYMENT.md manquant"

echo ""
echo "📦 Dépendances :"
[ -d "node_modules" ] && echo "  ✓ node_modules installé" || echo "  ⚠️  node_modules manquant (lance npm install)"

echo ""
echo "🏗️  Test de build :"
npm run build 2>&1 | tail -5

echo ""
echo "✨ Prêt pour le déploiement !"
echo ""
echo "📖 Consulte DEPLOYMENT.md pour les instructions complètes"
