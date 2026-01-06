# Script Registration Guide for End Users

## The Challenge
C++ requires compilation to create executable classes. Hephaestus uses Lua as the primary scripting language for gameplay; C++ is intended for engine internals and native modules and requires rebuilds.

## Current Workflow (What We're Fixing)

### Option A: Quick Testing (Legacy C++ workflow)
1. Write your native module in `engine/Game/ExampleScripts.h`
2. Register it in `engine/Core/main.cpp`
3. Rebuild the engine
4. Attach via editor

### Option B: Better (Legacy - Recommended Until Migration)
1. Write your native module in `/scripts/YourScript.h`
2. Include it in `engine/Game/ExampleScripts.h`
3. Register in `engine/Core/main.cpp` 
4. Rebuild
5. Attach via editor

## Planned Solutions

### Short-term (Next Update)
- **Script Registry Config File**: Create `scripts.json` in your project with:
  ```json
  {
    "scripts": [
      { "name": "AndyScript", "file": "scripts/AndyScript.h", "class": "AndyScript" },
      { "name": "PlayerControl", "file": "scripts/PlayerControl.h", "class": "PlayerControl" }
    ]
  }
  ```
- Engine auto-includes and registers scripts listed in config

### Medium-term
- **CMake Integration**: Auto-generate registration code from script files
- **Script Template Generator**: Create new scripts with registration stub

### Long-term (Best Solution)
- **Embedded Scripting Language** (Lua/Python/AngelScript)
- Users write game logic without touching C++ or rebuilding
- Full Godot/Unity-like experience

## For Now: Quickest Path to "No Engine Edits"

Create a helper script that:
1. Reads your project's `scripts/` directory
2. Generates a registration include file
3. You build once, scripts are auto-discovered

Would you like me to implement:
1. The scripts.json config approach?
2. An auto-discovery CMake system?
3. A Lua scripting integration?

Let me know which direction you prefer!
