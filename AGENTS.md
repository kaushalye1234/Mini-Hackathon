# Repository Guidelines

## Project Structure & Module Organization

This workspace is currently empty aside from this guide, so add structure deliberately as the project takes shape. Prefer a conventional layout:

- `src/` for application or library source code.
- `tests/` for automated tests that mirror source modules.
- `assets/` for static files such as images, fonts, fixtures, or sample data.
- `docs/` for design notes, setup details, and longer contributor references.

Keep configuration files at the repository root when possible, for example `package.json`, `pyproject.toml`, `Makefile`, or `.env.example`.

## Build, Test, and Development Commands

No build or test commands are defined yet. When tooling is added, document the primary commands here and keep them runnable from the repository root. Examples:

- `npm install` installs JavaScript dependencies.
- `npm run dev` starts a local development server.
- `npm test` runs the test suite.
- `make build` creates production artifacts when a `Makefile` is used.

Prefer scripts or make targets over long one-off commands so contributors have a stable interface.

## Coding Style & Naming Conventions

Follow the formatter and linter chosen for the project once they are introduced. Until then, use consistent indentation, descriptive names, and small modules with clear responsibilities. Use lowercase, hyphenated names for general files and directories such as `user-profile.md`; use language-standard naming for source files, for example `UserProfile.tsx` for React components or `user_profile.py` for Python modules.

## Testing Guidelines

Add tests with any new behavior. Place tests under `tests/` or next to the source file if the chosen framework expects colocated tests. Use clear names that describe behavior, such as `profile-form.test.ts` or `test_profile_form.py`. Document any coverage target after a test framework is selected.

## Commit & Pull Request Guidelines

This directory is not currently initialized as a Git repository, so no historical commit convention is available. Use short, imperative commit messages such as `Add profile form validation` or adopt Conventional Commits if the team prefers automation. Pull requests should include a concise summary, testing performed, linked issues when relevant, and screenshots for UI changes.

## Security & Configuration Tips

Do not commit secrets, local credentials, or generated private keys. When environment variables are needed, add `.env.example` with placeholder values and document required setup in `docs/` or this file.
