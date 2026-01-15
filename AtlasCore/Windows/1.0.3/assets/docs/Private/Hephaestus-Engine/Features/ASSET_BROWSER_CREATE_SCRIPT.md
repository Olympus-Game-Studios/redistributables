> ARCHIVED: The feature documentation was moved to `Documentation/Archive/C++_scripting_legacy/ASSET_BROWSER_CREATE_SCRIPT.md`.

Legacy C++-focused asset browser docs were archived. Use the Lua asset workflow docs in `Documentation/Scripting/` for current guidance.

## Features

✅ **Right-click context menu** - Access from any project  
✅ **Automatic file generation** - Creates `.lua` file  
✅ **Template code** - Pre-populated with lifecycle functions (`onAwake`, `onUpdate`, `onDestroy`)  
✅ **Organized storage** - Scripts created in `Scripts/` directory  
✅ **Ready to use** - Generated scripts follow the engine's Lua conventions  
✅ **User feedback** - Success/error messages displayed  

## How to Use

### Step 1: Right-Click on a Project
In the project browser, right-click on any project:

```
┌─────────────────────────────┐
│  MyProject                  │
│  [Right-click here]         │
└─────────────────────────────┘
```

### Step 2: Select "New Lua Script..."
A context menu appears with several options:

```
┌─────────────────────────────┐
│ Open                        │
├─────────────────────────────┤
│ New Lua Script...  ← Click  │
├─────────────────────────────┤
│ Add to Favorites            │
│ Open Folder                 │
│ Edit Details...             │
│ Delete Project...           │
└─────────────────────────────┘
```

### Step 3: Enter Script Name
A dialog opens asking for the script name:

```
┌─────────────────────────────────────┐
│ Create New Lua Script               │
├─────────────────────────────────────┤
│ Project: MyProject                  │
│                                     │
│ Script Name:                        │
│ [player_controller.lua     ]        │
│                                     │
│ (Will be created in project root    │
│  as a .lua file)                    │
│                                     │
│ [Create] [Cancel]                   │
└─────────────────────────────────────┘
```

### Step 4: Click Create
The script file is generated and saved to the project's `Scripts/` directory.

## Generated File

When you create a script named "player_controller.lua", a file is generated:

### `Scripts/player_controller.lua`
```lua
function onAwake()
    -- Initialization code
end

function onUpdate(deltaTime)
    -- Main game logic - called every frame
end

function onDestroy()
    -- Cleanup code
end
```

## File Location

Scripts are automatically created in:
```
MyProject/
└── Scripts/
    └── player_controller.lua
```

## Next Steps After Creation

1. **Edit the generated file** in your favorite text editor
2. **Add your game logic** to `onUpdate()` and other lifecycle functions
3. **Attach to entities** using the editor's script attachment UI

### Example: Using Your New Script

1. Select an entity in the scene
2. Open the Details Panel → Scripts
3. Click "Attach Lua Script" and enter `Scripts/player_controller.lua`
4. Press Play

## Script Template Structure

All generated scripts include the common lifecycle functions:

| Method | When Called | Purpose |
|--------|------------|---------|
| `onAwake()` | Once at startup | Initialize |
| `onUpdate(dt)` | Every frame | Main logic |
| `onDestroy()` | Before cleanup | Cleanup |

## Error Handling

The system provides helpful feedback:

- **"Please enter a script name"** - You left the script name field empty
- **"Failed to create script..."** - Filesystem error (check permissions)
- **"Script created successfully!"** - Success message shown for 3 seconds

## Implementation Details

### New Methods in ProjectManager

```cpp
// Display the new script dialog
void DrawNewScriptDialog();

// Create a Lua script file in the project
bool CreateLuaScript(const std::filesystem::path& projectPath, 
                     const std::string& scriptName);
```

### New UI State Variables

```cpp
bool m_ShowNewScriptDialog = false;           // Dialog visibility
char m_NewScriptNameBuffer[128] = {};         // User input buffer
ProjectInfo* m_ScriptDialogProject = nullptr; // Selected project
```

### Modified Methods

**ProjectManager::DrawProjectContextMenu()**
- Added "New Lua Script..." menu item
- Opens dialog when clicked

**ProjectManager::Draw()**
- Calls DrawNewScriptDialog() if dialog is active

## Tips & Best Practices

### 1. Use Descriptive Names
✓ `player_controller.lua` - Clear and descriptive  
✓ `enemy_ai.lua` - Specific purpose  
✗ `script1.lua` - Too generic  

### 2. Follow Naming Conventions
Use snake_case for Lua filenames and lower_case function names:
- ✓ player_controller.lua
- ✓ camera_follow.lua
- ✓ spawn_manager.lua

### 3. Organize in Subdirectories
Consider organizing complex projects:
```
Scripts/
├── gameplay/
│   ├── player_controller.lua
│   └── enemy_ai.lua
├── ui/
│   └── menu_manager.lua
└── utils/
    └── audio_manager.lua
```

### 4. Keep Scripts Focused
One responsibility per script:
- ✓ player_controller - handles player input and movement
- ✓ health_manager - manages health and damage
- ✗ mega_script - tries to do everything

## Troubleshooting

### Script file doesn't appear in project folder
- Make sure you clicked "Create" in the dialog
- Check that the `Scripts/` subdirectory was created
- Verify file permissions in the project directory

### Can't open the script file
- The file is created but may not be visible until you refresh
- Try opening the project folder directly with your file browser

### Permission denied error
- Check that you have write permissions to the project directory
- Make sure no other application has the project folder open

## Related Features

- **Script Registration**: `Documentation/Features/SCRIPTING_QUICK_START.md`
- **Script System**: `Documentation/Features/SCRIPTING_LAYER_GUIDE.md`
- **API Reference**: `Documentation/Features/SCRIPTING_API_REFERENCE.md`

## Summary

The "New Lua Script" feature streamlines script creation by:

1. ✅ Providing easy right-click access
2. ✅ Generating a ready-to-edit `.lua` template
3. ✅ Creating scripts in organized directories
4. ✅ Pre-populating lifecycle functions
5. ✅ Offering user feedback on success/failure

This makes it quick and easy to start creating game logic for your Hephaestus Engine projects using Lua.

---

**Feature Added**: November 10, 2025  
**Status**: Ready to use
