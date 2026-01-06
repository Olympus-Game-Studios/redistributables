# Getting Started with Hephaestus Engine

This guide walks you through:

1. Installing or launching the Hephaestus editor
2. Creating or opening a project
3. Creating a simple scene
4. Running the game from the editor

> This document intentionally avoids engine internals and low-level source code. It focuses on **using** the editor and scripting interfaces.

---

## 1. Installing / launching the editor

The engine is distributed internally as either:

- A **prebuilt editor executable**, or
- A **development build** from source (for engine developers)

For most users (designers, artists, scripters), the recommended path is the prebuilt editor.

1. Obtain the latest build from your internal distribution (e.g., shared drive, CI, or release server).
2. Extract the build to a local directory with a short path (avoid spaces and special characters if possible).
3. Launch the editor:
   - On Windows: run `HephaestusEditor.exe`
   - On other platforms, follow your platform-specific executable.

If you have trouble launching the editor (missing DLLs, driver errors, etc.), see [FAQ](faq.md) or contact the engine team.

---

## 2. Creating a new project

When the editor starts, you’ll typically see the **Project Browser**:

1. Click **New Project**.
2. Choose:
   - **Project Name** – a short, descriptive name.
   - **Location** – where the project will be stored on disk.
3. Click **Create** or **Confirm**.

The editor will create a basic project structure. A typical layout might look like:

- `Assets/` – Textures, models, audio, prefabs, etc.
- `Scripts/` – Gameplay and tools scripts (e.g., `.lua` files).
- `Scenes/` – Scene files (e.g., `.scene` or similar).
- `Config/` – Project settings and configuration files.
- `ProjectSettings.*` – High-level options like graphics, input, and build settings.

> Exact names and extensions may differ depending on your build. The important part is to keep assets, scripts, and scenes organized.

---

## 3. Opening an existing project

If you already have a project:

1. In the **Project Browser**, select **Open Project**.
2. Navigate to the project directory and select the project file (e.g., `MyGame.hproj`).
3. Click **Open**.

The editor will load the project’s scenes, assets, and settings.

---

## 4. The first scene

If this is a fresh project, you might see a default scene or an empty one.

To create a new scene:

1. Go to **File → New Scene** (or the equivalent menu/toolbar button).
2. Save the scene immediately:
   - **File → Save Scene As...**
   - Save it under `Scenes/` as something like `Main.scene`.

---

## 5. Adding an entity

An **entity** is a basic object in the scene (e.g., a player, light, camera, prop).

1. Open the **Scene Hierarchy** panel.
2. Right-click in the hierarchy and choose **Create Entity** (or similar).
3. Give it a name, such as `Player` or `TestBox`.

You should see the entity appear both in the hierarchy and in the **Inspector** panel.

---

## 6. Adding components

Entities are built from **components** like transforms, meshes, lights, cameras, and scripts.

To add a component:

1. Select your entity in the **Scene Hierarchy**.
2. In the **Inspector**, click **Add Component**.
3. Choose a component, for example:
   - `Transform` – position/rotation/scale (usually added by default)
   - `Mesh Renderer` – to display a 3D mesh
   - `Camera` – for the main view
   - `Script` – to attach a script (see [Scripting Overview](scripting-overview.md))

Adjust the component’s properties as needed.

---

## 7. Navigating the scene

See [Editor Controls](editor-controls.md) for full details. The basics usually include:

- **Right Mouse Button (RMB)** + `W/A/S/D` – move the editor camera
- **Mouse Wheel** – zoom in/out
- **Left Mouse Button (LMB)** – select entities

> The exact keybindings may be customized in editor settings.

---

## 8. Running the game

To preview your scene:

1. Ensure your main scene is open and saved.
2. Click the **Play** button in the editor toolbar.
3. The game will start running in the editor’s **Game View** or the main viewport.
4. Use the **Stop** button to return to editing mode.

When running, scripts and gameplay logic will execute as they would in a real build, but using the editor’s run-time environment.

---

## 9. Next steps

Once you can open the editor, create a project, and run a simple scene, you’re ready for:

- [Editor Overview](editor-overview.md) – Learn the layout and main panels.
- [Editor Controls](editor-controls.md) – Master camera and selection controls.
- [Scenes & Entities](scene-and-entities.md) – Understand how to structure your game content.
- [Scripting Overview](scripting-overview.md) – Begin adding behavior via scripts.