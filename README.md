# Redistributables

This repository holds compiled, redistributable artifacts for internal consumers and external launchers — for example compiled versions of the `HephaestusEngine` and finished game builds. Its purpose is to provide a predictable, discoverable location where tools and developers can find binaries, assets and minimal metadata required to run or package releases.

**Quick:**
- **Purpose:** central store for engine and game redistributables.
- **Consumers:** internal developers, CI systems, and launcher/integrator applications.

**What's In This Repo**

- `HephaestusEngine/` — compiled engine builds organized by version. Each version folder contains executables, runtime assets (shaders, textures, meshes) and editor/runtime settings.

Example layout (abridged):

```
HephaestusEngine/
  0.0.9/
    HephaestusEngine.exe
    HephaestusEngine.exe.bak
    imgui.ini
    settings.ini
    redistributable.json
    assets/
      meshes/
      textures/
      UI/
    build/
      Release/
        projects/
    editor/
      settings.ini
      assets/
        billboards/
      fonts/
      Icons/
        logo/
    projects/
    shaders/
      *.spv
```

Sections below explain how consumers (developers and launchers) should use and augment this repository.

**For Internal Developers**

- **Adding a redistributable:** Add a new folder under `HephaestusEngine/` (or a top-level folder for other projects) using a semantic version-like name (e.g. `1.2.3` or `0.0.9-nightly-20251224`).
- **Structure:** Place the engine/game entry binary at the top of the version folder and include any runtime `assets/`, `shaders/`, and `build/` output required to run it.
- **Metadata:** Add a lightweight `redistributable.json` next to the build root with at least `version`, `platform`, `entry`, and optional `checksum` and `tags` fields; example below.
- **Packaging:** For formal releases consider producing signed archives (.zip, .msix) with the same folder layout and placing the archive and the unpacked folder together.
- **Automation:** CI should write/update `redistributable.json`, publish artifacts here, and set appropriate ACLs for write access.

Example `redistributable.json`:

```json
{
  "name": "HephaestusEngine",
  "version": "0.0.9",
  "platform": "windows-x64",
  "entry": "HephaestusEngine.exe",
  "build_date": "2025-12-24T12:00:00Z",
  "tags": ["engine","release"]
}
```

**For Launcher Integrators / External Tools**

- **Discovery rules:**
  - Look under `HephaestusEngine/` for versioned folders.
  - Prefer a `redistributable.json` if present; otherwise, select the folder with the highest semantic version or latest timestamp.
  - Within a version folder, locate the `entry` executable or fallback to common names like `HephaestusEngine.exe`.
- **Search order (recommended):**
  1. `HephaestusEngine/<version>/redistributable.json` -> use `entry` field.
  2. `HephaestusEngine/<version>/` -> search for `<name>.exe` or a single executable at the folder root.
  3. `HephaestusEngine/<version>/build/Release/projects/` for packaged artifacts.
- **Fallback behavior:** If multiple platform builds exist, use the `platform` field or a platform-specific suffix in folder names.

Example pseudo-code for selecting latest build:

```text
list = scan("HephaestusEngine/")
pick = choose_highest_semver_or_latest(list)
if file_exists(pick/redistributable.json): load metadata and use entry
else: search for common executables in pick/ and pick the best candidate
```

**Versioning & Naming Conventions**

- Use semantic versioning where possible: `MAJOR.MINOR.PATCH`.
- For nightly or pre-release builds, append a clear suffix: `1.2.3-nightly-20251224`.
- Keep the folder name stable once published; add a new folder for each distinct redistributable.

**Security & Permissions**

- Only CI systems and authorized maintainers should have write access to this repository.
- Prefer signed packages for public distribution.
- Include checksums in `redistributable.json` if consumers validate integrity.

**Contributing**

1. Add the versioned folder containing the artifact and runtime files.
2. Add or update `redistributable.json` with required fields.
3. Create a short PR describing the artifact (version, platform, entry point, tags).
4. Request review from the release/engine owner.

**Contact & Ownership**

- Primary owner: Engine/Build Team (ask in the internal dev channel or refer to your team contact list).
- For launcher integration questions, contact the Platform/Launch Tools owner.

**Notes**

- This repo is intended as a simple redistributable index, not a package registry. For broader distribution use your official release channels.
- If you need an index API or machine-readable registry, we recommend adding a small server or index file alongside the artifacts and documenting its schema here.
