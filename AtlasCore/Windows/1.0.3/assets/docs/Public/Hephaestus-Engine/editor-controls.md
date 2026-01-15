# Editor Controls

This document covers the **default** controls for navigating the editor viewport, selecting entities, and using transform gizmos. Some builds may customize these bindings, but the patterns are generally similar.

> Always check the **Settings / Preferences → Input / Shortcuts** menu if your build supports remapping.

---

## 1. Viewport camera navigation

### Mouse + keyboard

Common default bindings:

- **Right Mouse Button (RMB)** + `W/A/S/D`  
  Free-fly camera movement (forward/back/strafe).

- **RMB** + `Q/E`  
  Move the camera down/up (vertical).

- **RMB** + **Mouse Move**  
  Rotate the camera (look around).

- **Mouse Wheel**  
  Zoom in/out or dolly the camera forward/back.

- **Middle Mouse Button (MMB)** drag  
  Pan the camera horizontally/vertically in orbit modes.

If your version uses orbit around a focus point:

- **Alt + LMB** – Orbit around the selection or pivot.
- **F** – Frame selected entity (focus camera on it).

---

## 2. Entity selection

- **Left Mouse Button (LMB)** click  
  Select an entity in the viewport or in the Scene Hierarchy.

- **Ctrl + LMB** click  
  Add/remove an entity from the current selection.

- **Drag selection box** (LMB drag in an empty area, if supported)  
  Select multiple entities within a rectangle.

Useful shortcuts:

- **F** – Focus camera on the currently selected entity.
- **Ctrl + D** – Duplicate the selected entity/entities.

---

## 3. Transform gizmos

The transform gizmo allows you to move, rotate, or scale entities in the viewport.

### Mode keys

Common mappings:

- **W** – Translate (Move)
- **E** – Rotate
- **R** – Scale

### Move (Translate)

- Select an entity.
- Press **W** for move mode.
- Drag an axis handle (X/Y/Z) to move along that axis.
- Drag the center cube/plane to move in a plane.

### Rotate

- Select an entity.
- Press **E** for rotate mode.
- Drag the colored circular handles to rotate around the corresponding axis.

### Scale

- Select an entity.
- Press **R** for scale mode.
- Drag axis handles to scale along that axis.
- Use the central cube (if present) for uniform scale.

---

## 4. Local vs World space

For translation and rotation, you can often switch between:

- **Local Space** – Gizmo axes follow the entity’s rotation.
- **World Space** – Gizmo axes align with the global world axes.

Look for a toggle in the toolbar (e.g., a globe vs. cube icon) or use a hotkey such as:

- **X** – Toggle local/world (example; may differ in your build).

---

## 5. Snapping

Snapping helps align entities precisely.

Common snapping types:

- **Position snapping** – Moves in fixed increments (e.g., 0.5 or 1 unit).
- **Rotation snapping** – Rotates in fixed degree increments (e.g., 15°).
- **Scale snapping** – Scales by fixed increments.

Typical controls:

- **Ctrl** (or **Shift**) while moving/rotating/scaling  
  Temporarily enable snapping.

- Toolbar toggles like:
  - **Snap** icon – enable/disable snapping.
  - Numeric fields – set the snap increment.

Check the editor’s top toolbar or settings to configure the exact values.

---

## 6. Scene play controls

In the toolbar:

- **Play** – Start running the current scene/game.
- **Pause** – Pause runtime, if supported.
- **Stop** – Stop and return to edit mode.

When playing:

- **Game View** or main viewport shows the running game.
- Input is usually captured by the game; editor controls are disabled until you stop.

---

## 7. Keyboard shortcuts reference

> Note: These are common default suggestions. Confirm in your build.

- **Ctrl + N** – New scene
- **Ctrl + O** – Open scene
- **Ctrl + S** – Save current scene
- **Ctrl + Shift + S** – Save all

- **Ctrl + Z** – Undo
- **Ctrl + Y** or **Ctrl + Shift + Z** – Redo

- **Del** – Delete selected entity/entities
- **Ctrl + D** – Duplicate selection
- **F** – Frame selected entity

- **W/E/R** – Move/Rotate/Scale gizmos
- **Space** – Cycle gizmo modes (if supported)
- **G** – Toggle grid (if supported)

---

## 8. Customizing controls

If your build supports it:

1. Open **Edit → Preferences** (or similar).
2. Look for **Input**, **Shortcuts**, or **Keybindings**.
3. Remap common actions like:
   - Viewport navigation
   - Select & transform
   - Play/pause/stop

Save your configuration, and consider exporting it if you work across multiple machines.