# ROADMAP 1.0 — Issues & 10-week plan (single developer)

This is a suggested per-week schedule to convert the remaining checklist into work and reach a 1.0 release over 10 weeks. Adjust durations to match your availability.

Week 1 — Core polish & CI prep
- Stabilize build instructions and verify Release build on a clean clone.
- Add the smoke-test runner script (local PowerShell) and verify it can start the runtime and load a simple scene.

Week 2 — Scripting design & minimal integration
- Decide on scripting runtime (Lua recommended). Wire a minimal embedding and host API for basic entity access. Add scripting folders `assets/scripts`.

Week 3 — Scripting examples & editor hooks
- Add example scripts (player input, one event). Make sure scripts can be run in editor and via exported runtime.

Week 4 — Exporter MVP
- Implement editor export action / packaging script. Ensure exported runtime can load serialized scene and assets.

Week 5 — Gameplay components (RigidBody)
- Implement `RigidBodyComponent` and simple collision responses using existing physics hooks.

Week 6 — Lighting & renderer wiring
- Add `LightComponent` (Directional, Point) and feed into renderer uniforms. Create a lighting demo scene.

Week 7 — QA & sample scene polish
- Finalize the demo scene with PBR materials, physics, and scripted interaction. Create `DEMO_README.md` and playthrough checklist.

Week 8 — Documentation & examples
- Write short Getting Started docs for scripting and export; update `ROADMAP_1-0.md` acceptance checklist with links.

Week 9 — CI, smoke-tests in Actions
- Add GitHub Actions workflow to run the smoke-test on PRs and main branch.

Week 10 — Final polish & release
- Run QA checklist, fix blockers, tag v1.0, prepare release notes.

Notes
- This schedule assumes part-time to full-time effort from a single developer. If more contributors join, shorten durations and parallelize tasks (scripting + exporter + CI in parallel).
