#!/bin/bash
# reset-demo.sh — limpia todas las ramas y PRs de demo para volver a correr el guion

echo "Cerrando PRs abiertos de demo..."
gh pr list --state open --json number --jq '.[].number' | xargs -I {} gh pr close {} --delete-branch 2>/dev/null

echo "Eliminando ramas remotas de demo..."
git fetch --prune
for branch in $(git branch -r | grep -E 'origin/(feature|hotfix)/' | sed 's/origin\///'); do
  git push origin --delete "$branch" 2>/dev/null && echo "  Eliminada: $branch"
done

echo "Eliminando ramas locales de demo..."
for branch in $(git branch | grep -E '(feature|hotfix)/' | tr -d ' '); do
  git branch -D "$branch" 2>/dev/null && echo "  Eliminada: $branch"
done

echo "Volviendo a main actualizado..."
git checkout main && git pull

echo ""
echo "Reset completo. Listo para correr el guion de nuevo."
