# Testing and Continuous Integration

This document explains the testing strategy, how to run tests locally, and CI expectations.

Testing pyramid
- Unit tests: fast, deterministic tests for isolated logic (math, parsers).
- Integration tests: test interactions between subsystems (renderer + resource loader).
- End-to-end / smoke tests: run the editor or sample app and assert high-level behavior.
- Fuzzing and stress tests: for parsers, asset importers, and scripting interfaces.
- Performance tests: benchmark critical paths and record baselines.

Running tests locally
- After building:
  ./build/bin/unit_tests
  ./build/bin/integration_tests
- Use gtest filters:
  ./build/bin/unit_tests --gtest_filter=MeshParser.*
- For graphical tests that require GPU, use CI-provided headless drivers or run on your local GPU.

Test authoring tips
- Keep unit tests focused and fast.
- Mock heavy dependencies where practical.
- Use CI-provided fixtures for platform-specific tests.
- Make tests self-contained (no external-server dependencies unless explicitly mocked).

CI pipeline (example)
- Pull Request triggers:
  - Sanity checks: formatting, linters
  - Build (Debug and Release)
  - Unit tests
  - Integration tests (as matrix jobs)
  - Static analysis (clang-tidy)
  - Optional: GPU-enabled integration jobs on dedicated runners
- Merge to main triggers:
  - Full build matrix
  - Packaging and artifact creation
  - Nightly perf regression job

Failure handling
- CI failures must be fixed before merge.
- For flaky tests: mark as flaky and investigate root cause. Do not ignore flakes permanently.
- Add CI logs and reproduction steps to the PR when asking for help.

Artifacts and test data
- Keep heavy test data in dedicated storage (LFS or internal bucket) and reference it in CI jobs.
- Store test outputs (sanitizer logs, profiler traces) as CI artifacts for debugging.

Sanitizers and sanitization
- Run ASan/UBSan builds on CI periodically to detect memory issues.
- Use LeakSanitizer and AddressSanitizer with appropriate suppression files if necessary.

Performance regression testing
- Maintain benchmarks and baselines in the repo or CI storage.
- If a PR changes perf-critical paths, include benchmark results comparing before/after.

Debugging failing tests
- Reproduce locally with the same compiler and CMake flags used by CI.
- Use core dumps or sanitizer logs to find memory errors.
- For rendering issues, capture frame dumps or use platform tools (RenderDoc).

CI tips for contributors
- Rebase regularly onto main to minimize surprises at merge time.
- Break large changes into smaller PRs that pass CI independently.