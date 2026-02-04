.PHONY: install dev build preview test lint lint-fix typecheck ci clean

install: ## Install dependencies
	bun install

dev: ## Start dev server
	bun run dev

build: ## Production build (typecheck + bundle)
	bun run build

preview: ## Preview production build locally
	bun run build
	bun run preview

lint: ## Run ESLint
	bun run lint

lint-fix: ## Run ESLint with auto-fix
	bun run lint:fix

typecheck: ## Run TypeScript type checking
	bun run typecheck

test: ## Run tests
	bun test

ci: lint typecheck test build ## Run full CI pipeline locally (lint + typecheck + test + build)

clean: ## Remove build artifacts and dependencies
	rm -rf dist node_modules .vite

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
