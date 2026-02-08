# Pre-commit hooks for Daily Game Tracker
# 
# To set up, run:
#   bun add -D simple-git-hooks
#   echo '{"*": {"pre-commit": "bun run pre-commit-check"}}' > .simple-git-hooks.json
#
# Or manually create .git/hooks/pre-commit

# Pre-commit check script
# Runs linting, type checking, and tests before committing

#!/bin/bash
set -e

echo "🔍 Running pre-commit checks..."

# Run Biome linter
echo "📝 Running Biome linter..."
bun run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix the issues before committing."
  exit 1
fi

# Run type checking
echo "📝 Running TypeScript type check..."
bun run typecheck
if [ $? -ne 0 ]; then
  echo "❌ Type checking failed. Please fix the type errors before committing."
  exit 1
fi

# Run tests
echo "🧪 Running tests..."
bun test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Please fix the failing tests before committing."
  exit 1
fi

echo "✅ All pre-commit checks passed!"
exit 0
