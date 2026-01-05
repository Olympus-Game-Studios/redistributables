# Scripting Overview

Hephaestus Engine exposes a scripting layer that allows you to:

- Implement gameplay logic
- Create simple tools and utilities
- Configure entity behavior without rebuilding the engine

This document explains the **conceptual** model. For specific functions and classes, see [Scripting API](scripting-api.md).

> The exact language and APIs may differ slightly between projects and builds. The examples here assume **Lua** as the main scripting language, but the overall workflow is similar for other languages.

---

## 1. Where scripts live

Scripts are typically stored under a `Scripts/` directory in your project, for example:

- `Scripts/Player/PlayerController.lua`
- `Scripts/AI/EnemyPatrol.lua`
- `Scripts/Systems/DialogueSystem.lua`

Organize scripts by feature (e.g., Player, AI, UI) rather than mixing everything in one folder.

Avoid placing scripts directly next to engine internals; keep them within the project’s script area.

---

## 2. Script lifecycle

Most scripts in Hephaestus Engine are **component scripts** attached to entities, with a typical lifecycle like:

- `OnInit` – Called when the script is first initialized (e.g., scene load).
- `OnUpdate(deltaTime)` – Called every frame while the game is running.
- `OnDestroy` – Called when the entity or script is destroyed.
- Optional event callbacks (e.g., `OnCollisionEnter`, `OnTriggerEnter`, etc., depending on your build).

Example (Lua-style pseudocode):

```lua
function OnInit()
    -- Called once
end

function OnUpdate(dt)
    -- Called every frame
end

function OnDestroy()
    -- Cleanup
end
```

The exact function names and signatures may differ; see [Scripting API](scripting-api.md) or existing scripts in your project for the canonical pattern.

---

## 3. Attaching scripts to entities

To attach a script:

1. Select an entity in the **Scene Hierarchy**.
2. In the **Inspector**, click **Add Component**.
3. Choose something like **Script**, **Lua Script**, or **Script Component** (depending on your build).
4. In the script component:
   - Assign the script file from the **Asset Browser** or via a file picker.
   - Configure any exposed script variables (see below).

When the scene runs:

- The engine will load and execute the script.
- Lifecycle callbacks (`OnInit`, `OnUpdate`, etc.) will fire automatically.

---

## 4. Exposed script variables

Scripts may expose variables to the editor so designers can tweak them without editing code.

Example (Lua-like):

```lua
speed = 5.0        -- Movement speed
jumpForce = 10.0   -- Jump strength
```

Depending on your build, this may be supported via:

- Naming conventions
- An API call (e.g., `ExposeProperty("speed", 5.0)`)
- A metadata or annotation system

Once exposed:

- These variables appear in the script component section of the **Inspector**.
- Designers can adjust them, and the new values are used at runtime.

Check an existing script in your project to see the exact pattern used to expose variables.

---

## 5. Accessing the entity and components

Scripts usually have a way to access:

- The **current entity** they are attached to
- Other components on that entity (e.g., transform, rigidbody, audio, etc.)
- Other entities in the scene by name/tag

Examples (pseudocode):

```lua
-- Get the transform of this entity
local transform = this:GetTransform()
transform.position.x = transform.position.x + 1.0

-- Find another entity
local player = FindEntityByName("Player")
if player then
    local playerTransform = player:GetTransform()
end
```

> Note: The exact API names (`this`, `GetTransform`, `FindEntityByName`) depend on your build. See [Scripting API](scripting-api.md) for the official naming.

---

## 6. Common scripting use cases

Typical tasks done in scripts:

- **Player control** – Movement, jumping, input processing.
- **AI behavior** – Patrolling, chasing, state machines.
- **Interaction** – Opening doors, toggling lights, triggers.
- **UI logic** – Updating HUD elements, responding to game events.
- **Spawning** – Creating entities at runtime.
- **Simple tools** – Editor utilities or debug visualizers (if supported).

---

## 7. Debugging scripts

You can debug scripts using:

- **Console logging** – e.g., `print("Something happened")`.
- **Runtime console** – To inspect variables or logs.
- **On-screen debug draw** – For lines, boxes, text overlays (if supported by your build).

Common patterns:

```lua
print("Player speed is", speed)
```

If your build integrates with an external debugger (for example a dedicated Lua debugger), refer to internal documentation on setting that up. Public docs typically keep it at the level of logging and in-engine tools.

---

## 8. Performance considerations

When scripting:

- Avoid heavy allocations or expensive operations in `OnUpdate` every frame if possible.
- Cache references to frequently used components (e.g., transform, rigidbody).
- Use timers or events instead of polling every frame when appropriate.

Most performance-critical systems should be implemented on the C++ side by the engine team; scripts should focus on **game logic and glue code**.

---

## 9. Next steps

For concrete examples and API documentation, continue to:

- [Scripting API](scripting-api.md) – Overview of common engine functions and objects exposed to scripts.
- Existing game project scripts – Real-world patterns used by your team.