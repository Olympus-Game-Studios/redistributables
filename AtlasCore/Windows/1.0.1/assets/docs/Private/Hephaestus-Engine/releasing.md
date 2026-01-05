# Releasing and Versioning

Guidance for making releases, tagging, and preparing artifacts for engine users and downstream consumers.

Versioning policy
- We use semantic versioning (MAJOR.MINOR.PATCH).
  - MAJOR: incompatible API changes
  - MINOR: added functionality, backwards compatible
  - PATCH: bug fixes, backwards compatible
- For engine-internal API changes that may impact public game projects, increment MAJOR or MINOR as appropriate and document migration steps.

Release process (high level)
1. Prepare release branch:
   git checkout -b release/x.y.z main
2. Update version constants and CHANGELOG.md
3. Run full test matrix and performance regression tests
4. Resolve critical issues and tag release candidate
5. Tag final release:
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin vX.Y.Z
6. Publish artifacts (binaries, docs, SDKs) to release page or internal distribution system.

Changelog and release notes
- Update CHANGELOG.md with user-facing changes.
- Add a developer-focused RELEASE_NOTES.md for breaking changes and migration notes.
- Include known issues and recommended workarounds.

Binary artifacts and SDK
- Build release artifacts for supported platforms:
  - Editor binaries, Engine SDK (headers + libs), prebuilt third-party libs
- Publish artifacts to:
  - GitHub Releases for public assets
  - Internal artifact repository for large assets or proprietary builds

Hotfixes
- For critical fixes post-release:
  - Create a hotfix branch from the release tag or main
  - Apply fix and create a patch release (PATCH version bump)
  - Ensure hotfixes are merged back into main and other maintained branches

Automation and reproducibility
- Use CI to produce reproducible builds and signed artifacts.
- Archive build logs and checksums for each release.

Deprecation policy
- Mark APIs as deprecated with comments and runtime warnings where feasible.
- Maintain deprecation for at least one minor release before removal.

Security releases
- For security-related fixes, follow the private disclosure channel and coordinate a release with security notes and CVE assignment if needed.

Post-release checklist
- Notify downstream users and engine teams (email/slack)
- Create follow-up issues for any non-blocking improvements
- Update documentation site for user-facing changes