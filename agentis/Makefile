.PHONY: dev build build-sidecar clean

# Start backend + Vite + Tauri in development mode
dev:
	@echo "Starting Agentis in development mode..."
	@cd backend && uv run uvicorn main:app --port 57431 --host 127.0.0.1 --reload & \
	pnpm tauri dev

# Build the PyInstaller sidecar binary
build-sidecar:
	@echo "Building backend sidecar..."
	@bash backend/build_sidecar.sh

# Production build (requires sidecar to be built first)
build: build-sidecar
	@echo "Building Agentis for production..."
	pnpm tauri build

# Remove build artifacts
clean:
	@rm -rf src-tauri/target
	@rm -rf dist
	@rm -rf src-tauri/binaries/agentis-backend-*
	@echo "Clean complete"
