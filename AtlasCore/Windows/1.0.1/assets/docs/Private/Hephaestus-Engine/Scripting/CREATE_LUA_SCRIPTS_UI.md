# Create Lua Scripts from Asset Browser ✅

## What's New

You can now **right-click in the Asset Browser** to create Lua scripts.

## How to Use

### Creating a Lua Script

1. **Right-click in the Asset Browser** (empty space)
2. Select **"New Lua Script..."**
3. Enter a name (e.g., "my_script")
4. Click **"Create"**
5. ✅ Done! A `.lua` file is created in `scripts/` subdirectory

## Directory Structure

When you create scripts, they're organized as follows:

```
assets/
├── scripts/
│   ├── my_script.lua          (Lua scripts go here)
│   ├── another_script.lua
│   └── ...
└── (other assets)
```

Note: C++ gameplay scripting is deprecated. Use Lua for gameplay scripts; C++ remains for engine internals.

## Template Content

When you create a new Lua script, it includes helpful template code:

```lua
-- my_script.lua
-- Lua script for Hephaestus Engine

function onAwake()
    print("[my_script] Script awakened")
end

function onUpdate(deltaTime)
    -- Main game logic - called every frame
    -- deltaTime is time elapsed since last frame in seconds
end

function onLateUpdate(deltaTime)
    -- Called after onUpdate - useful for post-processing logic
end

function onDestroy()
    print("[my_script] Script destroyed")
end
```

## Next Steps

1. **Create a Lua script** from Asset Browser
2. **Edit the file** in your favorite editor
3. **Attach to entity** via Details Panel
4. **Run in play mode** to see it execute!

## Context Menu

Right-click in Asset Browser to see:
- New Folder...
- New Material...
- New Lua Script...

---

**You can now create Lua scripts directly from the editor!** 🎉
