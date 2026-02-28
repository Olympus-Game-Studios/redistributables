# Hephaestus Engine Documentation

Welcome to the public documentation for **Hephaestus Engine**, the in-house game engine developed by **Olympus Game Studios**.

This documentation is focused on **using** the engine and tools rather than explaining or exposing the source code. It is intended for:

- Designers working primarily in the editor
- Technical artists iterating on content and scenes
- Scripters writing gameplay and tools scripts
- External collaborators who need to understand how to work with the engine safely

If you are looking for low-level engine internals or code architecture details, please refer to our **internal/private documentation** instead.

---

## What is Hephaestus Engine?

Hephaestus Engine is a custom game engine with:

- A fully-featured **editor** for placing and editing scenes, entities, and components
- A **scripting layer** (primarily via Lua) for gameplay logic, tools, and configuration
- A **modern C++ rendering backend** with GLSL-based shaders
- Project-based workflows that integrate with version control and asset pipelines

> Note: The engine is under active development. Some features shown here may differ slightly from your build. When in doubt, contact the engine team.

---

## Documentation index

- [Getting Started](getting-started.md)  
  Install the engine, create your first project, and learn how to open the editor and run a simple scene.

- [Editor Overview](editor-overview.md)  
  Learn the main editor layout: hierarchy, inspector, viewport, console, and other essential panels.

- [Editor Controls](editor-controls.md)  
  Camera navigation, object selection, transform controls, snapping, and other key shortcuts.

- [Scenes & Entities](scene-and-entities.md)  
  How scenes are organized, how entities and components work from a user perspective.

- [Scripting Overview](scripting-overview.md)  
  How scripting fits into the engine, where scripts live, and how they are attached to entities.

- [Scripting API](scripting-api.md)  
  Frequently used engine APIs available from scripts, with examples.

- [Workflow & Best Practices](workflow-and-best-practices.md)  
  Recommended project structure, version control workflows, and team collaboration guidelines.

- [FAQ](faq.md)  
  Quick answers to common questions and troubleshooting steps.

---

## Contributing to the docs

If you spot missing information or an error in this documentation:

1. Create a new branch in the `Olympus-Game-Studios/Hephaestus-Engine` repository.
2. Edit the relevant `.md` files in the `docs/` directory.
3. Open a pull request with a short summary of your changes.

Please **avoid including confidential or proprietary details** from private documentation in these public docs.