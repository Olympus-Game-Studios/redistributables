# Roadmap to 1.0 release

This document describes the goals, milestones, and success criteria for the Hephaestus Engine 1.0 release.

1.0 is defined as the first public, documented, and buildable milestone where the engine can be used to create tech demos and small game projects. At 1.0 we expect the engine to provide a stable runtime separate from the editor, a basic content pipeline (meshes, textures, materials), level support, scripting integration, and an editor workflow that enables building a distributable game runtime.

## Contract (what 1.0 delivers)

- Inputs: the repository source, example assets in `assets/`, and the third-party libraries in `extern/` and `ThirdParty/`.
- Outputs: a tagged 1.0 release containing:
  - Build targets for a distributable runtime (Release x64 Win) and an editor build.
  - A sample playable tech demo project (levels + scripts) that can be run independently of the editor.
  - Documentation covering build steps, basic engine usage, and a short developer guide for levels and scripting.
- Error modes: build failures, missing imports, and script runtime errors should be reproducible and have mitigation steps documented.

Assumptions: small core team (1–3 engineers) and an initial 8–12 week effort baseline. Adjust timelines if the team size or priorities differ.

## Success criteria (must be true for 1.0)

1. Core build: CMake-based builds complete for Release x64 on Windows with no mandatory manual steps.
2. Runtime: can load a sample level and run it with rendering, input, and simple physics interactions.
3. Editor: can edit a scene/level and export a build that runs as a standalone runtime.
4. Scripting: scripting layer integrated with at least one example script controlling gameplay or level flow.
5. Documentation: build and run instructions, plus a short "Getting Started" guide for content creators.
6. Tests: small automated tests or smoke checks for scene loading and startup are present.
7. Sample assets: a minimal curated set of assets (meshes, textures, shaders) included for the sample project.

## High-level milestones & estimated timeline

Note: timelines are estimates. Replace durations as needed for your team.

- Phase A — Core Stabilization (2–4 weeks)
  - Stabilize build system and CMake targets. Ensure Release and Editor configurations build reproducibly.
  - Add smoke tests: engine startup, scene load, renderer init.

- Phase B — Content & Pipeline (2–4 weeks)
  - Asset importers and basic material system (textures, meshes). Ensure assets in `assets/` import and display.
  - Create a sample level with placeholder assets.

- Phase C — Scripting & Gameplay (1–3 weeks)
  - Integrate a scripting runtime (Lua/embedded scripting) or stabilize existing script interface.
  - Ship example scripts for player input and simple AI/interaction in the sample level.

- Phase D — Editor & Export (2–4 weeks)
  - Editor features required to assemble a level and export game content.
  - Implement an export/build pipeline that produces a distributable runtime and copies required assets.

- Phase E — Polish, Documentation & Release (1–2 weeks)
  - Finalize docs, create release notes, run QA checklist, tag release.

## Milestone details (mapping to repository areas)

- Engine core (folders: `engine/Core`, `engine/Scene`, `engine/Assets`)
  - Tasks: stabilize ECS, scene serialization, asset manager reliability, memory/handle leaks.
  - Deliverable: engine loads and runs a serialized level file without editor attached.

- Graphics (folders: `engine/Gfx`, `shaders/`, `extern/` Diligent or renderer)
  - Tasks: ensure shader compilation pipeline is documented; verify shader variants and SPIR-V generation in `shaders/`.
  - Deliverable: consistent frame rendering of sample assets and a debug UI to display stats.

- Physics (folder: `engine/Physics`)
  - Tasks: stable collision/rigid-body interactions for simple gameplay; deterministic behavior on startup.
  - Deliverable: sample interactions (e.g., falling object, simple collisions) in the demo level.

- UI & Editor (`editor/`)
  - Tasks: basic scene graph, transform tools, simple asset browser, and scene export.
  - Deliverable: create and export a scene which the runtime can load.

- Tools & ThirdParty (`extern/`, `ThirdParty/`)
  - Tasks: lock versions used in the repo, ensure build instructions for third-party libs are tested.
  - Deliverable: documented steps to regenerate externals or instructions to use prebuilt libs.

- Project management & build scripts (root CMakeLists, `build/`)
  - Tasks: test clean build steps, update any packaging scripts, and document release build flow.
  - Deliverable: documented and verified Release build steps in README and CI (if available).

## Owners & roles (suggested)

- Engine lead: core systems, scene, asset manager
- Graphics lead: renderer, shaders, performance
- Tools lead: editor, export pipeline
- QA/Release: release checklist, builds, sample verification

If you have specific contributors, map them to these roles and add GitHub issue labels like `roadmap/1.0`, `milestone/core`, `milestone/editor`.

## Acceptance checklist (pre-release)

- [ ] Release build succeeds with documented commands on a clean clone.
- [ ] Sample level runs end-to-end: load → play → close (no crashes).
- [ ] Editor exports produce a runtime package that runs the level.
- [ ] At least one scripting example is included and documented.
- [ ] Documentation: Build & Getting Started guides written and reviewed.
- [ ] QA smoke tests included and passing locally.

## Risks and mitigations

- Risk: Build breaks due to third-party updates. Mitigation: pin third-party versions and add short reproduction steps.
- Risk: Asset pipeline edge-cases (missing metadata, large textures). Mitigation: include sample importer tests and fallback behavior.
- Risk: Scripting integration complexity. Mitigation: limit 1.0 scripting scope to simple gameplay hooks and well-documented API.

## Metrics & quality gates

- Basic metrics to track for 1.0: startup time (cold), sample level frame-time (average), memory footprint.
- Add simple assertions in startup smoke tests to detect major regressions.

## Post-1.0 / Next steps

- Larger feature work (networking, advanced renderer features, editor UX improvements) moved to 1.x backlog.
- Improve CI test coverage and add platform builds (Linux/macOS) if relevant.

## How to use this roadmap

- Convert milestones into GitHub issues and link them to `milestone: 1.0`.
- Prioritize must-haves (core build, runtime, editor export, scripting example) and track progress against the acceptance checklist.

---

If you want, I can:
- turn these milestones into issues and a suggested timeline (per-week breakdown),
- or apply smaller changes: add an automated smoke-test runner, or add the acceptance checklist as a GitHub Actions job.


(End of roadmap draft)

## Project status — what is done now and what remains

Summary of the current repository state (single developer, ready to onboard others). These points were inferred from the repository and build output found under `build/`, `engine/`, `editor/`, and `extern/`.

### Done / Remaining checklist (explicit)

Below is an explicit checklist table summarizing the repository evidence and the remaining work recommended for 1.0. Use the checkboxes to track progress as you complete items.

| Item | Status | Evidence / Notes | Path(s) |
|---|---:|---|---|
| Core build & editor executable | [x] | Release binary and libs present in build output; CMake targets configured | `build/`, `CMakeLists.txt` |
| Entity-Component-System (ECS) & Scene | [x] | Scene.cpp, Entity.cpp, SceneSerializer.cpp and docs | `engine/Scene/`, `Documentation/ECS_GUIDE.md` |
| Scene serialization & sample pipeline | [x] | Scene serializer source and README references | `engine/Scene/SceneSerializer.cpp` |
| Material system & node editor (PBR) | [x] | Material editor sources, guides and shaders present | `engine/UI/MaterialEditor/`, `shaders/`, `Documentation/` |
| Asset loading (models, textures) | [x] | Model importer + assets folders | `engine/Assets/`, `assets/` |
| Editor UI & ImGui integration | [x] | Editor folder and extern/imgui, ImGuizmo, imnodes | `editor/`, `extern/` |
| Shaders (sources + SPIR-V) | [x] | GLSL sources and precompiled `*.spv` files; shader compile logic in CMake | `shaders/` |
| Third-party libraries wired | [x] | EnTT, GLFW, VMA, stb_image present in `extern/` | `extern/` |
| Documentation coverage | [x] | Extensive docs under `Documentation/` covering ECS, materials, ray picking, etc. | `Documentation/` |
| Editor → Runtime export & packaging | [ ] | Requires verification / implementation of automated export that packages runtime + assets | (todo: document or implement) |
| Scripting integration & example scripts | [ ] | Not found in codebase; required for 1.0 per roadmap | (todo: integrate Lua/C# or chosen runtime) |
| Automated CI / smoke-tests | [ ] | No CI workflows or automated smoke-tests detected in repo root | (todo: add GitHub Action / script) |
| Additional gameplay components (RigidBody, Lights) | [ ] | README lists as immediate work; not fully implemented | `engine/Physics/`, `engine/Scene/` |
| QA pass, sample level polish & playthrough | [ ] | Need a finished demo scene with documented playthrough checks | `assets/`, `Documentation/` |

This table is intended as the single source-of-truth checklist for the 1.0 roadmap. Mark items as complete as you implement or verify them.

### Done (observed in repo)

- Core build & editor executable present
  - Evidence: `build/Release/HephaestusEngine.exe`, `build/imgui.lib`, `build/imguizmo.lib` and Visual Studio projects in `build/`.
  - CMake targets configured in `CMakeLists.txt`.

- Entity-Component-System (EnTT) and Scene system
  - Evidence: `engine/Scene/` sources (Scene.cpp, Entity.cpp, SceneSerializer.cpp) and documentation (`Documentation/ECS_GUIDE.md`).

- Scene serialization & sample scene pipeline
  - Evidence: `engine/Scene/SceneSerializer.cpp` and documentation references to scene save/load in README and Documentation.

- Material system and PBR workflow with node-based editor
  - Evidence: `engine/UI/MaterialEditor/*` sources, `Documentation/LIGHTING_AND_MATERIALS_GUIDE.md`, and prebuilt shader SPIR-V files in `shaders/`.

- Asset loading and basic pipeline
  - Evidence: `engine/Assets/ModelImporter.cpp`, `assets/meshes/`, `assets/textures/`.

- Editor UI and ImGui integration (with ImGuizmo, ImNodes)
  - Evidence: `editor/` contents, `extern/imgui`, `extern/ImGuizmo`, `extern/imnodes`, and CMake wiring for ImGui/ImGuizmo.

- Shader sources + precompiled SPIR-V
  - Evidence: `shaders/*.vert|*.frag` and `*.spv` files; CMake has shader compile logic guarded by presence of glslc.

- Third-party libraries present and wired
  - Evidence: `extern/entt/`, `extern/glfw/`, `extern/imgui/`, `extern/VMA/`, `extern/stb_image.h` and CMake find/link targets.

- Documentation coverage for many engine features
  - Evidence: large `Documentation/` folder with ECS guides, material guides, ray picking notes, and integration docs.

### Partially done / needs verification

- Editor → Runtime export flow (packaging)
  - There is a working editor and runtime binary, but a documented, automated export pipeline that packages assets and produces a redistributable runtime needs verification or enhancement.

- Automated tests / CI smoke checks
  - No obvious test harness or CI configuration in the repo root for automated build+smoke tests. README suggests manual smoke tests are used.

### Remaining (recommended priority for 1.0)

- Scripting integration and example scripts (required for 1.0 per roadmap)
  - Status: Not present in code paths or marked as implemented in README; planning/implementation required. Suggest integrating Lua or another lightweight runtime and shipping 1–2 example scripts.

- Acceptance checklist automation
  - Create scripts or a small test runner to validate build → startup → scene load each time; add as a GitHub Actions job or local PowerShell script.

- Export pipeline and packaging
  - Implement or document a reproducible editor export flow that copies serialized scene data, required assets (`assets/`) and runtime binary into a distributable folder.

- More component/system coverage (Physics, RigidBody, Lights)
  - README lists these as immediate future work (RigidBody, Light components). Implement at least a simple RigidBody + Light component for demo scenes.

- QA pass and polish (docs, examples, sample level completeness)
  - Add a small, completed sample level demonstrating PBR materials, a scripted interaction (once scripting is added), and a short playthrough checklist for QA.

## Suggested mapping: repo evidence → roadmap checklist

- Mark Done: core build, ECS, scene serialization, material system, asset loading, editor UI, shader pipeline, third-party wiring, documentation.
- Mark To Do (for 1.0): scripting integration, automated smoke-tests/CI, editor export packaging, additional gameplay components (RigidBody, Lights), and QA polish.

---

If you'd like, I can now:
- add the Done/Remaining checklist as an explicit table in the roadmap file (with checkboxes),
- or create a small suite of GitHub issues (one per remaining item) and a suggested per-week timeline tailored for you as the sole developer or a small team.