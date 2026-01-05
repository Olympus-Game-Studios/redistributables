# Editor Keyboard Shortcuts

This document describes all available keyboard shortcuts in the Hephaestus Engine editor.

## World Outliner (Scene Hierarchy)

The World Outliner manages entities in your scene with the following keyboard shortcuts:

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Shift+Backspace / Delete` | Delete Entity | Removes the currently selected entity from the scene |
| `Ctrl+Shift+D` | Duplicate Entity | Creates a copy of the selected entity with all its components |
| `Ctrl+Z` | Undo Last Change | Restores the scene to its previous state |
| `Esc` | Deselect | Clears the current entity selection |

### Usage Notes

- **Shift+Backspace / Delete (Delete)**: Works when the World Outliner window is focused and you're not typing in a text field
- **Ctrl+Shift+D (Duplicate)**: Uses the scene clipboard system to copy all components from the selected entity
- **Ctrl+Z (Undo)**: Reverts the most recent entity-level change (delete, duplicate, paste)
- **Deselect**: Useful for clearing selection before making new selections

### Entity Context Menu

Right-click on any entity in the World Outliner to access the context menu:
- Delete (Shift+Backspace / Delete) - Same as pressing the keyboard shortcut

## Material Editor (Node Graph)

The Material Editor provides a node-based visual material authoring system with these shortcuts:

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Shift+D` | Delete Nodes/Links | Removes selected nodes and connections from the material graph |
| `Esc` | Deselect All | Clears node and link selections |
| `F` | Frame Selected | Centers the viewport on the selected node |
| `Right-click` | Add Node Menu | Opens context menu to add new nodes |

### Usage Notes

- **Ctrl+Shift+D (Delete)**: 
  - Works on both selected nodes and selected links
  - The Material Output node cannot be deleted (it's protected)
  - Multiple nodes/links can be deleted at once by selecting them first
  
- **Frame Selected**: 
  - Press F to automatically pan the view to center on your selected node
  - Helpful when working with large material graphs
  
- **Node Selection**:
  - Click to select a single node
  - Ctrl+Click to multi-select nodes
  - Click and drag to box-select multiple nodes

### Material Editor Context Menu

Right-click in empty space within the node canvas to access the add node menu:
- **Material Output** - The final output node for your material
- **Scalars** - Constant Float, Float Parameter
- **Colors** - Constant Color, Color Parameter  
- **Textures** - Albedo, Normal, Roughness, AO texture samplers
- **Math** - Add, Multiply operations

## General Editor Shortcuts

These shortcuts work across the entire editor:

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Play` | Enter Play Mode | Starts scene simulation with physics and scripts |
| `Pause` | Pause Simulation | Pauses the running simulation |
| `Stop` | Exit Play Mode | Stops simulation and restores editor state |
| `Save` | Save Scene | Saves the current scene to disk |
| `Build` | Build Project | Compiles project resources |
| `Ctrl+Z` | Undo Last Change | Restores the previous scene snapshot (available while not simulating) |

## Viewport Controls

When the viewport is focused:

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Left Click` | Select Entity | Picks and selects an entity in the scene |
| `W` | Translate Gizmo | Switches to translation/move mode |
| `E` | Rotate Gizmo | Switches to rotation mode |
| `R` | Scale Gizmo | Switches to scale mode |

## Best Practices

1. **Use keyboard shortcuts for faster workflows**: Memorizing common shortcuts like Delete, Duplicate, and Deselect significantly speeds up scene editing
2. **Check the help tooltips**: Hover over the "?" icon in each panel to see available shortcuts
3. **Multi-selection**: Use Ctrl+Click in the material editor to work with multiple nodes at once
4. **Safe deletion**: The editor protects critical nodes (like Material Output) from accidental deletion

## Implementation Details

### Delete Key Protection

The delete functionality includes safeguards:
- Only works when the relevant window is focused
- Disabled when typing in text input fields (`WantTextInput` check)
- Material Output nodes are protected from deletion in the material editor
- Provides visual feedback through context menu shortcuts

### Clipboard System

The entity duplication system uses the scene's built-in clipboard:
- `CopyEntityToClipboard()` - Copies entity component data
- `PasteClipboard()` - Creates a new entity with copied components
- Supports common components: Transform, Mesh, Lights, Colliders, etc.

### Focus Management

Shortcuts respect window focus:
- `ImGui::IsWindowFocused(ImGuiFocusedFlags_RootAndChildWindows)` ensures the correct window owns the shortcut
- Text input fields take priority to prevent accidental deletions while typing

## Future Enhancements

Planned keyboard shortcuts for future releases:
- `Ctrl+C` / `Ctrl+V` - Copy/paste nodes in material editor
- `Ctrl+Z` / `Ctrl+Y` - Undo/redo for scene and material changes  
- `Ctrl+S` - Quick save shortcut
- `Ctrl+A` - Select all entities/nodes
- `H` - Hide/show selected entities
- `Alt+Click` - Alternative selection modes

## See Also

- [Material Editor Guide](../Guides/LIGHTING_AND_MATERIALS_GUIDE.md)
- [ECS Guide](../Guides/ECS_GUIDE.md)
- [Scene Management](../Architecture/ECS_ARCHITECTURE_DIAGRAM.md)
