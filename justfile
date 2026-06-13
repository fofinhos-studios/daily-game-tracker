# Default recipe: show help
default:
    @just --list

# Install dependencies
install:
    bun install

# Start dev server
dev:
    bun run dev

# Production build (typecheck + bundle)
build:
    bun run build

# Preview production build locally
preview:
    bun run build
    bun run preview

# Run Biome linter
lint:
    bun run lint

# Run Biome linter with auto-fix
lint-fix:
    bun run lint:fix

# Format code with Biome
format:
    bun run format

# Run TypeScript type checking
typecheck:
    bun run typecheck

# Run tests
test:
    bun test

# Refresh supported-game favicons
favicons:
    python3 scripts/fetch_favicons.py

# Run full CI pipeline (lint + typecheck + test + build)
ci: lint typecheck test build

# Remove build artifacts and dependencies
clean:
    rm -rf dist node_modules .vite
