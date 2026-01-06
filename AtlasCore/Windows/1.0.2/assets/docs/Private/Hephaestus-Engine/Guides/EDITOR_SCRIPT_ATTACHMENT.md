# Attaching Scripts via Editor UI

## Overview

The Details Panel in the Hephaestus editor now includes a **Scripts** section that allows you to attach scripts to entities without writing any code.

## How to Attach a Script

### Prerequisites
1. Your script must be registered with the ScriptRegistry
2. The entity must have a ScriptComponent (automatically created when you add a script)
3. The script name must match the registered name exactly (case-sensitive)

### Steps

1. **Select an Entity**
   - In the World Outliner panel, select the entity you want to attach a script to
   - The Details Panel updates to show that entity's components

2. **Find the Scripts Section**
   - Scroll down in the Details Panel
   - Look for the **Scripts** collapsible header
   - Click to expand it

3. **View Attached Scripts**
   - The section displays all currently attached scripts as a bullet list
   - Each script shows the registered name (e.g., "PlayerController", "RotatingCube")

4. **Add a New Script**
   - In the text field labeled "Add Script:", type the script name
   - Click the "Attach" button
   - If the script is registered, it will be added to the entity
   - The text field clears automatically on success

5. **Available Scripts**
   - To see which scripts are available, check:
     - The console output when the engine starts (all registered scripts are printed)
     - The ScriptRegistry::GetRegisteredScripts() list
     - Your `/scripts/` directory

## Example Workflow

```
1. Editor starts → Scripts are auto-registered (output to console)
2. Create an entity → "Cube"
3. Select "Cube" in outliner → Details Panel updates
4. Scroll to find "Scripts" section
5. Type "PlayerController" in the input field
6. Click "Attach" → Script is attached
7. Click Play → PlayerController's OnAwake() runs, OnUpdate() called every frame
8. Click Stop → PlayerController cleaned up
```

## Available Example Scripts

By default, these scripts are registered:
- **PlayerController** - WASD movement, mouse look, sprint
- **RotatingCube** - Spins the entity continuously
- **SimpleMovement** - Moves in a circle
- (Add more by creating files in `/scripts/` and registering them)

## Troubleshooting

### "Script not found in registry"
- Check the console output on engine startup
- Verify script name matches exactly (case-sensitive)
- Make sure the script is properly registered in `main.cpp`

### Script doesn't run in play mode
- Click Play button to enter play mode
- Verify the script's OnUpdate() method is implemented
- Check the Log Console for errors

### No Scripts section visible
- Select a different entity or create a new one
- The entity may not have a ScriptComponent yet
- Add a script to create the component automatically

## Integration Details

The Scripts UI section:
- Located in `engine/Core/main.cpp` in the `DrawDetailsPanel()` function (lines ~872-907)
- Uses ImGui for rendering UI elements
- Calls `ScriptRegistry::CreateScript()` to instantiate scripts
- Validates script names before creating instances

## API Reference

### ScriptRegistry Methods Used
```cpp
// Check if a script is registered
bool ScriptRegistry::IsRegistered(const std::string& scriptName);

// Create a script instance
ScriptPtr ScriptRegistry::CreateScript(const std::string& scriptName, 
                                      Entity entity, 
                                      Scene* scene);

// Get list of all registered scripts
std::vector<std::string> ScriptRegistry::GetRegisteredScripts();
```

### ScriptComponent Methods Used
```cpp
// Add a script to an entity
void AddScript(ScriptPtr script, const std::string& scriptName);

// Get list of script names
std::vector<std::string> scriptNames;

// Get list of script instances
std::vector<ScriptPtr> scripts;
```

## Notes

- Multiple scripts can be attached to the same entity
- Scripts are executed in the order they were attached
- Removing a script must be done programmatically (feature pending)
- Scripts persist through play/stop cycles if not destroyed
