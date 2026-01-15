# Architecture Overview

This document summarizes Hephaestus Engine's high-level architecture, core subsystems, and where to look in the codebase when you need to modify or extend functionality.

Core concepts
- Engine core: bootstrap, main loop, subsystem manager, event bus.
- Renderer: abstraction layer for graphics API (Vulkan/DirectX/Metal), resource management, frame graph, and render passes.
- Resource system: virtual file system, asset importers, runtime resource loading and streaming.
- Scene/runtime: entities, components, scene graph, transforms, serialization.
- Physics: colliders, rigid bodies, collision detection and response.
- Audio: playback, mixing, spatialization.
- Scripting: language bindings (Lua/JS/C#), script lifecycle integration.
- Tools: editor modules, asset pipeline, debug UI.

Code organization (example)
- src/core/ — core bootstrap, logging, config
- src/renderer/ — render abstraction, drivers, frame graph
- src/assets/ — importers, serializer, resource manager
- src/scene/ — entity/component systems, serialization
- src/physics/ — physics backend, integration
- src/tools/ — editor and tooling code
- scripts/ — helper scripts, build helpers
- third_party/ or libs/ — vendored libs and shims

Key subsystems and design notes
1. Subsystem Manager
   - Responsible for lifecycle ordering (initialize, update, shutdown).
   - Register subsystem dependencies to guarantee ordering.

2. Event Bus / Messaging
   - Centralized pub-sub used by engine systems for decoupling.
   - Prefer event structs over strings for type safety.

3. Renderer
   - Abstracted API: platform-specific code isolated behind a renderer interface.
   - Frame graph: declarative pass definition and resource lifetime management—use it for new render effects.
   - Resource lifetime: explicit GPU resource creation and transition API.

4. Resource and Asset Pipeline
   - Editor-time importers convert source assets to a runtime format.
   - Runtime streaming enables background load of large assets.
   - Asset GUIDs remain stable across builds—use them for references.

5. Scene & ECS
   - Components are POD-like and serialized in a stable on-disk format.
   - Systems query components in cache-friendly patterns; prefer batched operations.

Where to start when changing behavior
- To add a new rendering pass: src/renderer/framegraph + examples in src/renderer/passes.
- To add a new component type: src/scene/components, add serializer, and update the editor inspector.
- To add a new scripting API: scripts/bindings + src/scripting/<language>.

Guidelines for major changes
- Respect subsystem boundaries; prefer adding extension points if cross-cutting changes are needed.
- Add unit tests for isolated logic (math, resource parsing) and integration tests for subsystem interactions.
- Update architecture.md when you introduce new subsystems or change lifecycles.

Diagrams and visual references
- Keep architecture diagrams in docs/diagrams (SVG/PNG) and update them when the design changes.