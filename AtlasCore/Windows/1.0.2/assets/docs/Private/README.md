
# Olympus Game Studios — Documentation Wiki

Welcome to the central documentation repository for Olympus Game Studios. This repository is the canonical source for guides, design notes, API references, tutorials, and roadmaps used across our projects. The Markdown files here are published to our internal documentation website (our private wiki) and are intended to be the single source-of-truth for team members and contributors.

## What you'll find here

- `Hephaestus-Engine/` — Design docs, architecture notes, guides and feature documentation for the Hephaestus Engine project.
	- Architecture, Guides, Features, Integration notes, Lighting, Project Manager docs, Tutorials, and Reference material are organized inside.
- Top-level reference files — repository-level READMEs and roadmaps that describe cross-project plans and contribution guidance.

The repo contains a mix of high-level strategy (roadmaps), developer-facing guides (API, integration, engine architecture), and step-by-step tutorials and how-tos.

## How the wiki works

- Source: Each Markdown file in this repo is a page or section in the internal documentation site.
- Publishing: Changes committed to this repo are picked up by our documentation pipeline and published to the internal site (check with the docs owner or ops team for the exact deployment cadence).
- Navigation: Use the website for full-text search, sidebar navigation, and cross-page linking. Locally, you can open any `.md` file in your editor and use the Markdown preview.

## Quick navigation

- To find a topic quickly, use your editor or Git host search. Start in `Hephaestus-Engine/` for engine-specific docs.
- Major entry points inside `Hephaestus-Engine/`:
	- `Architecture/` — architecture diagrams and ECS notes
	- `Features/` — feature specs, scripting guides and API references
	- `Guides/` and `Tutorials/` — step-by-step guides and walkthroughs
	- `Reference/` — concise reference material

## Index (quick links)

Use these links as starting points when exploring the site or the repository. They point to the most-used landing pages and README files inside the `Hephaestus-Engine` subtree:

- [Hephaestus Engine — Overview](Hephaestus-Engine/README.md)
- [Architecture home](Hephaestus-Engine/Architecture/ARCHITECTURE_README.md)
- [Features index](Hephaestus-Engine/Features/FEATURES_README.md)
- [Guides home](Hephaestus-Engine/Guides/GUIDES_README.md)
- [Tutorials home](Hephaestus-Engine/Tutorials/TUTORIALS_README.md)
- [Reference home](Hephaestus-Engine/Reference/REFERENCE_README.md)
- [External Libraries](Hephaestus-Engine/ExternalLibraries/EXTERNAL_LIBS_README.md)
- [Roadmap & plans](Hephaestus-Engine/ROADMAP.md)

If a link returns a 404 in your editor, the file may be titled slightly differently or moved into a subfolder; try searching the repo for the page name.

## How to contribute

We welcome contributions to keep the docs accurate and useful. Suggested workflow:

1. Branch from `main` and give your branch a descriptive name (e.g., `docs/physics-update`).
2. Edit or add Markdown files. Keep prose clear and short. Use relative links (`./path/to/file.md`) for internal links so they work in-editor and on the site.
3. Commit with a meaningful message and open a Pull Request targeting `main`.
4. Request a review from the owner(s) listed in the PR template or the relevant team (engine, tooling, art, etc.).

Notes and conventions:
- Keep sections focused. If a change is large, consider splitting it into multiple PRs (content vs. formatting).
- When adding API or code examples, include minimal, copy-paste-ready snippets and note language/context.
- If a doc describes a breaking design or public API change, link to the relevant design proposal or RFC.

## Syncing external library documentation

Documentation for external libraries (ImGui, JoltPhysics, etc.) is managed via the sync script. To update:

```powershell
.\sync-external-docs.ps1
```

See [EXTERNAL_DOCS_SYNC_GUIDE.md](EXTERNAL_DOCS_SYNC_GUIDE.md) for details.

## Previewing changes locally

- In VS Code: open the Markdown file and use the built-in Markdown preview (right-click → "Open Preview" or press `Ctrl+Shift+V`).
- For full-site preview: check with the docs owner for the recommended local tooling (some projects use MkDocs, Docusaurus, or a custom preview server). If you need that added here, open an issue so we can standardize the local build.

## Ownership and contact

If you're unsure who to ask about a particular page, look for the `CONTRIBUTING.md` or per-folder README files (for example `Hephaestus-Engine/CONTRIBUTING.md`) which may list owners. Otherwise, open an issue or contact the documentation maintainers on the team chat.

