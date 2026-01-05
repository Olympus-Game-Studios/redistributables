# Script Attachment via Asset Browser - Fixed

## What Was Wrong
Scripts were defined but **never registered** with the `ScriptRegistry`. This meant:
- The registry was empty when the Details Panel tried to look up scripts
- Clicking Attach would fail silently with a "not found" error to console

## What's Fixed
**Added script registration** in `engine/Core/main.cpp` (line ~3172) right after `scriptEngine.Initialize(&scene)`:

```cpp
// Register example scripts
ScriptRegistry::Register<RotatingCube>("RotatingCube", 
    [](Entity entity, Scene* scene) {
        return std::make_shared<RotatingCube>(entity, scene);
    }
);
ScriptRegistry::Register<SimpleMovement>("SimpleMovement",
    [](Entity entity, Scene* scene) {
        return std::make_shared<SimpleMovement>(entity, scene);
    }
);
// Register user scripts
ScriptRegistry::Register<PlayerController>("PlayerController",
    [](Entity entity, Scene* scene) {
        return std::make_shared<PlayerController>(entity, scene);
    }
);
```

## How to Use Now

### Method 1: Select from Asset Browser (Recommended)
1. Open the Asset Browser (bottom panel)
2. Navigate to `/scripts/` folder
3. **Click** on a script file (e.g., `PlayerController.h`)
4. In the Details Panel, you'll see: "Asset Browser selection: PlayerController"
5. Click **Attach** (leave the input field empty)
6. The script is now attached!

### Method 2: Type Script Name
1. In the Details Panel Scripts section, type a script name in the input field (e.g., `RotatingCube`)
2. Click **Attach**
3. The script is attached

## Console Output on Startup
When the engine starts, you'll see:
```
Registered script: RotatingCube
Registered script: SimpleMovement
Registered script: PlayerController
```

This confirms scripts are available for attachment.

## Troubleshooting

**"Script not found in registry"** error:
- Check console at startup for registration messages
- Verify the script name matches exactly (case-sensitive)
- Make sure the script is registered with `ScriptRegistry::Register()`

**Script shows in Details but doesn't run in Play mode:**
- Enter Play mode (click Play button)
- Check the Log Console for errors
- Verify the script's `OnAwake()` and `OnUpdate()` are implemented

**Asset browser selection not showing:**
- Make sure to **click** (select) the script file, not double-click it
- The selection should appear as "Asset Browser selection: ScriptName"
