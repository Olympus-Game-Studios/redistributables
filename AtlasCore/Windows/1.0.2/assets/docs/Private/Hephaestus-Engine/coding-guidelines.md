# Coding Guidelines

These guidelines help keep the codebase readable, maintainable, and safe across contributors. They are suggestions and rules used by reviewers during code review.

Style and formatting
- Use the repository .clang-format file. Run clang-format before committing.
- Keep lines <= 100 columns where practical.
- Prefer expressive naming; match existing patterns in the module you're modifying.
- Keep functions short and single-purpose.

Language-specific guidance (C++ core)
- Prefer modern C++ (C++17/C++20 where allowed):
  - Use smart pointers (std::unique_ptr, std::shared_ptr) explicitly when ownership semantics require them.
  - Prefer value semantics for small structs.
  - Use span/view types for read-only ranges.
- Avoid global mutable state. If a subsystem needs single-instance access, inject it or use the subsystem manager.
- Prefer constexpr, noexcept where appropriate.
- Use small header files: avoid including heavy headers in other headers; prefer forward declarations.

Memory and performance
- Profile before optimizing.
- Favor contiguous data structures for hot paths (std::vector over lists).
- Be explicit about ownership and lifetimes; document thread-affinity.
- For GC-style features (scripting), document how native and script objects interact and who owns what.

API design and stability
- Public engine API must be stable. When changing a public API:
  - Add deprecation shims for at least one release cycle.
  - Document breaking changes in RELEASE_NOTES.md and CHANGELOG.
- Design APIs for clarity; prefer explicit over implicit behavior.

Error handling and logging
- Use the engine's logging facility (log levels: trace, debug, info, warn, error, critical).
- Avoid swallowing errors silently; propagate or return errors with context.
- Use assertions for developer-only invariants, not for recoverable errors.

Tests, documentation, and examples
- Every non-trivial new feature should include:
  - Unit tests for core logic
  - Integration test if it touches multiple subsystems
  - Minimal example in samples/ or editor demo
- Document new public APIs in docs/api/ with examples.

Commit messages and PRs
- Write a short subject (<=72 chars) then a blank line and a detailed body if needed.
- Reference issues with "Fixes #<n>" when closing bugs.
- Ensure tests pass and CI is green before merging.

Security and safety
- Validate and sanitize all data coming from assets and external sources.
- Apply least privilege for any OS-level operations.
- Be conservative with third-party library upgrades—run a full test pass.

Code review checklist (for reviewers)
- Does the change have a clear purpose and minimal surface area?
- Are modules and APIs consistent with project patterns?
- Are there tests, and do they cover edge cases?
- Any potential performance regressions or memory leaks?
- Is logging and error handling adequate?
- Are the docs and CHANGELOG updated?

Tooling (recommended)
- clang-format (enforced)
- clang-tidy (static checks)
- pre-commit hooks: run formatting and basic linters automatically
- Unit test framework: GoogleTest or project-specific framework