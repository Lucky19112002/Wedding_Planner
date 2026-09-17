# Changelog

Newest entries first. This root changelog records repository and release milestones. Detailed product documentation changes remain in `/docs`.

## [v0.3.4-repository-workflow] - 2026-09-18

### Added

- Root README with architecture, setup, branch workflow, commit convention, release workflow, roadmap, and documentation links.
- MIT license.
- Repository workflow standards for `main`, `dev`, Conventional Commits, and phase release tags.

### Changed

- Updated `.gitignore` to keep generated dependency/build output out of Git while allowing the private repo to track `.env`.

### Security

- Repository is private because `.env` is tracked for restore on a new PC.
