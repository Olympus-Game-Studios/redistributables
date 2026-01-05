# Contributing (Engine Development)

This document explains the preferred workflow for contributing to Hephaestus Engine, branch rules, PR expectations, and how to write a good changelog.

Issue workflow
- Create an issue for new bugs, features, and design discussions.
- Use labels:
  - area/<subsystem> (e.g., area/renderer)
  - type/bug, type/feature, type/refactor
  - priority/high / medium / low
- For design-level changes, open an RFC issue that describes:
  - Problem statement
  - Proposed design (alternatives considered)
  - API changes and migration plan
  - Impacted modules and tests required

Branching model
- main (or master): always green; production-ready.
- develop (optional): integration branch for feature work (if used).
- Feature branches:
  - feat/<short-desc>
  - fix/<short-desc>
  - perf/<short-desc>
  - refactor/<short-desc>
- Branch naming: lowercase, hyphens, prefix with area if desired:
  e.g., feat/renderer-vulkan-dynamic-resources

Pull request guidelines
- Open a PR from your feature branch to main (or develop if used).
- PR title: concise summary; body explains rationale and scope.
- Include:
  - What changed and why
  - Screenshots or perf numbers if applicable
  - Testing done (local and CI)
  - Migration steps or deprecation notes
- Link related issues (e.g., Fixes #123)

PR checks and reviewers
- Ensure the following pass before requesting review:
  - Formatting / linters
  - Unit and integration tests
  - CI status green
- Assign reviewers:
  - At least one owner of the affected subsystem
  - A peer for cross-checks
- Address review comments promptly and re-run CI if needed.

Merging policy
- Squash or rebase merges are preferred for a linear history (follow repo policy).
- PR must be approved by at least one subsystem owner and pass CI.
- If a PR touches public APIs, ensure CHANGELOG and deprecation notices are included.

Code ownership and reviewers
- Each subsystem should have owners listed in CODEOWNERS (update when people move on).
- If no owner is available, nominate a knowledgeable reviewer or the module maintainer.

Release notes and CHANGELOG
- Add a short entry to CHANGELOG.md for user-visible changes or to RELEASE_NOTES.md for developer-facing breaking changes.
- Use conventional changelog categories: Added, Changed, Deprecated, Removed, Fixed, Security.

Keeping PRs small
- Prefer multiple small PRs rather than a single large one.
- Break cross-cutting changes into:
  - API design and tests
  - Implementation
  - Performance/optimizations and benchmarks
  - Documentation

Helping new contributors
- Tag issues as "good first issue" for small, contained tasks.
- Provide reproduction steps and expected results for bugs.
- Add links to relevant design docs or files to explore.

Legal and licensing
- Ensure third-party libraries have compatible licenses.
- For any new third-party dependency, add a note to DEPENDENCIES.md with license and usage reason.

Security reporting
- For security vulnerabilities, follow the private security disclosure process (contacts in repo root). Do not disclose issues publicly until fixed.

Thank you — your contributions make Hephaestus better!