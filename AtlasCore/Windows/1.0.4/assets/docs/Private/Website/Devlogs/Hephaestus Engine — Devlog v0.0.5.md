# Hephaestus Engine — Devlog v0.0.5
Date: 10-11-2025

Quick summary
- Current release: Hephaestus Engine v0.0.5
- Short-term goal: v0.1.0 by 2025-12-31
- Primary languages: C++ (≈96%) and GLSL (shaders)
- Availability: Not publicly released yet. We plan a staged public rollout; a free-for-indie offering is targeted around releases 2.x–3.x.

Intro
Hephaestus is our in-house game engine that’s reached a meaningful milestone with v0.0.5. This devlog gives a public snapshot of where the engine stands today, the improvements in this release, the plan to reach v0.1.0 by the end of the year, and how we’ll approach public availability and indie-friendly licensing further down the road.

What’s new in v0.0.5
v0.0.5 is a stability-and-foundation release. It’s focused on consolidating core systems, improving developer workflow, and removing a number of hard-to-reproduce crashes that slowed iterative development.

Highlights
- Core & architecture
  - Stabilized the main engine lifecycle (initialization, update loop, shutdown) and tightened module boundaries.
  - Improved plugin/module initialization order to prevent startup races and reduce hard crashes.
- Rendering & shaders
  - Refinements to the rendering pipeline and resource lifetime management for meshes and textures.
  - GLSL shader hot-reload in developer builds for faster iteration on effects and materials.
- Asset & resource pipeline
  - More robust asset loader with caching and basic dependency tracking.
  - Reduced memory spikes during bulk/imported asset operations.
- Tools & developer experience
  - Better logging and debug layers to speed diagnosis.
  - Improved build scripts and C++ build configuration checks.
- Stability fixes
  - Addressed several multi-threaded loading crashes and a number of memory leaks/dangling pointer issues.
- Documentation
  - Updated README and basic developer onboarding guidance (build & run steps, dev flags).

Technical snapshot
- Codebase composition: primarily C++ for engine core and systems, with GLSL used for GPU shader programs and effects.
- Current readiness: Core loop, rendering, and resource management are stable and reliable for internal development and prototyping. Subsystems such as audio, physics, editor tooling, and higher-level gameplay APIs are functional but need additional polish for a production-ready v0.1.0.
- Platform focus: Desktop-first (Windows / Linux / macOS). Mobile and console support are on the roadmap but require additional QA and platform-specific work.

Roadmap to v0.1.0 (target: 2025-12-31)
We’re on a focused path to deliver v0.1.0 by December 31, 2025. To keep scope realistic and hit the date, we’re prioritizing core stability and developer experience over large new feature additions.

Stabilization phase (now → mid Nov)
- Finalize resource lifetime semantics and thread-safety for asset loaders.
- Complete baseline physics integration (deterministic single-frame updates and basic collision).
- Implement a minimal, reliable audio playback and mixing baseline.
- Expand unit and integration tests for critical systems.

Tooling & polish (late Nov → mid Dec)
- Merge a basic in-engine debug UI or minimal editor inspection tools for scene & resource inspection.
- Improve shader tooling, compiler feedback, and hot-reload UX.
- Add lightweight profiling hooks and perf diagnostics.

Documentation, demos & release (mid Dec → 2025-12-31)
- Finalize API documentation and a “getting started” guide for external developers.
- Produce a small end-to-end demo scene that demonstrates asset pipeline → render → physics → audio.
- Final QA, bug triage, packaging and tagging of v0.1.0.

Milestones (short examples)
- 2025-11-20 — Lock API for core systems and merge stabilization PRs.
- 2025-12-05 — Merge basic editor/inspection tooling.
- 2025-12-18 — Sample demo and documentation draft complete.
- 2025-12-31 — v0.1.0 release.

Availability & licensing (public note)
- Private for now: Hephaestus is not yet publicly available as a packaged engine or binary download. We are preparing for a staged public rollout after v0.1.0 with beta access for interested developers.
- Indie-friendly target: Our long-term plan is to offer a free tier or free-for-indie licensing roughly around the 2.x–3.x release window. To keep that promise realistic, we’re designing the engine with modular features so that core functionality suitable for indie development remains freely usable while more advanced or enterprise features can be separated if needed.
- When we open public access, we will publish clear licensing terms and a simple FAQ so there are no surprises.

Known limitations
- Editor UX is minimal — expect CLI and small demo apps for now.
- Some subsystems are feature-incomplete and will be enhanced post-1.0.
- Performance edge-cases under very large scene/asset loads are under investigation.
- Platform coverage outside desktop is limited at present.

How you can help
(For early testers, contributors, and partners)
- Test internal builds and exercise the sample/demo scenes; provide reproducible bug reports.
- Submit focused PRs: crash fixes, leak fixes, build fixes, and smaller tooling improvements are most useful right now.
- Help write documentation, onboarding guides, and “how to” tutorials.
- Create sample content that stresses the asset pipeline and rendering.
- If you’re an indie developer interested in early access or a future free tier, register your interest on our website (we’ll publish a signup) so we can prioritize outreach.

Example short release blurb (public-facing)
Hephaestus Engine v0.0.5 is a foundation and stability milestone. The engine is currently in private/internal builds for contributors and partners. Our next target is v0.1.0 by 2025-12-31, with a staged public rollout afterwards and a promise to provide a free-for-indie option around the 2.x–3.x release window.

Contact & follow
- Follow Olympus Game Studios for updates on the public rollout and licensing plans. We’ll publish a public announcement and documentation once staged access begins.
- If you’re a partner, contributor, or press contact, reach out via the official channels listed on our website.

Thank you
We’re proud of the progress to v0.0.5 — the engine’s foundations are solid and we’re in a focused phase to get to a stable v0.1.0. We appreciate testers, early adopters, and contributors who help us reach the next milestone.