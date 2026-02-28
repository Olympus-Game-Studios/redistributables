# Editor Overview

This document introduces the main parts of the **Hephaestus Engine** editor and how they fit together.

The exact layout may differ between versions, but most builds include the following:

- Main menu & toolbar
- Scene viewport
- Scene hierarchy
- Inspector / properties panel
- Asset browser
- Console / output
- Additional tabs (profiler, logs, etc., depending on your build)

---

## 1. Main menu & toolbar

At the top of the editor:

- **File** – Open/save scenes and projects, project-level settings, exit.
- **Edit** – Undo/redo, copy/paste, duplicate, global preferences.
- **View / Window** – Show or hide panels, layout presets.
- **Tools** – Project-specific tools, importers, or debug utilities.
- **Help** – Build information, about dialog, documentation links.

The **toolbar** usually includes:

- **Play / Pause / Stop** buttons to run the game inside the editor.
- **Transform gizmo** mode buttons:
  - Translate / Rotate / Scale
  - Local / World space toggle
- **Snapping** controls:
  - Position/rotation snapping
  - Grid toggle

See [Editor Controls](editor-controls.md) for detailed shortcuts.

---

## 2. Scene viewport

The **Scene viewport** is where you visually edit the world:

- Use the camera controls to orbit, pan, and zoom.
- Select entities by clicking them.
- Use transform gizmos (move/rotate/scale) to place entities.

You can usually toggle between **Scene View** (edit mode) and **Game View** (play mode):

- **Scene View** – Tools and gizmos are visible, input goes to the editor.
- **Game View** – The game is running and takes input, simulating a build as closely as possible.

---

## 3. Scene hierarchy

The **Scene Hierarchy** lists all entities in the current scene, often in a tree:

- Each row represents an entity.
- Nested entities represent parent-child relationships (e.g., a weapon under a character).
- Right-click to create, duplicate, delete, or group entities.

Common actions:

- **Rename** – Double-click the entity name.
- **Re-parent** – Drag an entity under another.
- **Toggle visibility** – Some builds include visibility/lock icons.

The hierarchy does not show all engine internals—only the **user-facing entities** and their relationships.

---

## 4. Inspector / properties panel

The **Inspector** shows the properties of the currently selected entity or asset.

Typical workflow:

1. Select an entity in the **Scene Hierarchy** or **Scene View**.
2. The Inspector lists its components.
3. Edit component fields:
   - Numbers (position, rotation, scale, intensity, etc.)
   - Enums (modes, types)
   - References (assigning assets or scripts)
4. Add or remove components from the same panel.

The Inspector is the main place to:

- Attach scripts (see [Scripting Overview](scripting-overview.md))
- Tune gameplay parameters
- Configure rendering properties (materials, lights, cameras)

---

## 5. Asset browser

The **Asset Browser** (sometimes called Content Browser or Project Browser) exposes your project’s assets:

- Folders mirror the on-disk project structure.
- Assets can include:
  - Meshes / models
  - Textures and materials
  - Audio files
  - Prefabs / entity templates
  - Scripts
  - Scenes

Typical actions:

- **Double-click** an asset to open it in the appropriate editor or inspector.
- **Drag & drop** assets into the Scene viewport or onto fields in the Inspector (e.g., drag a material onto a mesh renderer).

---

## 6. Console / output

The **Console** displays:

- Log messages (info, warnings, errors)
- Script printouts (e.g., `print` in Lua)
- Runtime issues (missing assets, script errors)

Recommended usage:

- Keep the console visible while developing gameplay and scripts.
- Filter by severity (errors only, warnings, etc.).
- Double-click a log entry when supported to jump to the relevant asset or script.

---

## 7. Layout customization

The editor layout is usually dockable and customizable:

- Drag tabs to rearrange panels.
- Dock panels to the sides or as floating windows.
- Save layout presets via **Window → Layout** (or similar menu) if supported.

If your layout becomes unusable, look for an option like **Reset Layout** in the View/Window menu.

---

## 8. Next steps

Now that you understand the main parts of the editor:

- Learn detailed controls and shortcuts in [Editor Controls](editor-controls.md).
- Learn how scenes, entities, and components behave in [Scenes & Entities](scene-and-entities.md).
- Start adding logic via [Scripting Overview](scripting-overview.md).