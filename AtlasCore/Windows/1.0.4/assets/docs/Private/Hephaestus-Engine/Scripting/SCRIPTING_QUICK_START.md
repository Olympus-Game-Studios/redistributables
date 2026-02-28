# Quick Start: Scripting in Hephaestus Engine

Welcome to the Hephaestus Engine scripting system! This guide gets you writing game code in minutes.

## The Default: Lua Scripting

Hephaestus uses **Lua** as its primary scripting language. Lua offers:
- ✅ **Fast iteration** - No recompilation needed
- ✅ **Easy syntax** - Beginner friendly
- ✅ **Good performance** - Plenty fast for gameplay logic
- ✅ **Instant reload** - Changes take effect immediately

**Future**: C# scripting support is planned for future releases.

---

## Method 1: Lua Scripting (Fast Iteration)

### Prerequisites

Install Lua first (see LUA_INSTALLATION_GUIDE.md):

**Windows**:
```powershell
.\\vcpkg install lua:x64-windows
cd build && cmake .. && cmake --build . --config Release
```

**Linux**:
```bash
sudo apt-get install liblua5.3-dev
cd build && cmake .. && cmake --build . --config Release
```

### Step 1: Create Your Lua Script

Create `engine/Game/scripts/my_script.lua`:

```lua
function onAwake()
    print("[Lua] Script awakened!")
    
    -- OOP-style: Use 'this' to access entity components
    local transform = this:GetTransform()
    local pos = transform:GetPosition()
    print("[Lua] Starting position: " .. pos.x .. ", " .. pos.y .. ", " .. pos.z)
end

function onUpdate(deltaTime)
    print("[Lua] Running... delta time: " .. deltaTime)
    
    -- Check input
    if Input.isKeyPressed("W") then
        print("[Lua] W key pressed!")
    end
    
    -- OOP-style: Access transform through 'this'
    local transform = this:GetTransform()
    local pos = transform:GetPosition()
    print("[Lua] Position: " .. pos.x .. ", " .. pos.y .. ", " .. pos.z)
    
    -- Functional style also works:
    -- local pos = Transform.getPosition()
end

function onDestroy()
    print("[Lua] Script destroyed")
end
```

### Step 2: Attach to Entity

1. Select entity in scene
2. Scroll to "Lua Scripts" section in Details Panel
3. Click "Attach Script"
4. Enter path: `engine/Game/scripts/my_script.lua`
5. Press Play button
6. **No rebuild needed!** Changes take effect immediately (restart play mode)

### Step 3: Iterate Rapidly

Edit your `my_script.lua`, stop play mode, restart play mode. That's it!

---

## Common Tasks

### Move an Entity in Script

**Lua (OOP-style)**:
```lua
function onUpdate(deltaTime)
    local transform = this:GetTransform()
    transform:Translate(5.0 * deltaTime, 0, 0)
end
```

**Lua (Functional-style)**:
```lua
function onUpdate(deltaTime)
    Transform.translate(5.0 * deltaTime, 0, 0)
end
```

### Detect Input

**Lua**:
```lua
function onUpdate(deltaTime)
    if Input.isKeyPressed("W") then
        -- W pressed
    end
    if Input.isMouseButtonPressed(0) then
        -- Left mouse clicked
    end
end
```

### Rotate an Entity

**Lua (OOP-style)**:
```lua
function onUpdate(deltaTime)
    local transform = this:GetTransform()
    transform:Rotate(0, 0, 1.0 * deltaTime)
end
```

**Lua (Functional-style)**:
```lua
function onUpdate(deltaTime)
    Transform.rotate(0, 0, 1.0 * deltaTime)
end
```

---

## Script Lifecycle

All Lua scripts follow the same lifecycle:

```
┌──────────────────┐
│  File Attached   │
└────────┬─────────┘
         │
    ┌────▼────┐
    │ onAwake  │  Called once when script first attached
    └────┬────┘
         │ (Repeat each frame during play mode)
    ┌────▼──────────┐
    │ onUpdate(dt)  │  Called each frame, first
    └────┬──────────┘
         │
    ┌────▼──────────────┐
    │ onLateUpdate(dt)  │  Called after all onUpdates
    └────┬──────────────┘
         │
    ┌────▼───────────┐
    │ onDestroy       │  Called when script detached or entity destroyed
    └─────────────────┘
```

---

## Debugging

### Lua Scripts

- Use `engine_log("message")` to print to console
- Use `print("message")` also works
- Check Output panel for `[Lua]` prefixed messages

Example:
```lua
function onAwake()
    engine_log("[MyScript] Initialized successfully")
end

function onUpdate(deltaTime)
    engine_log("[MyScript] Frame delta: " .. deltaTime)
end
```

### Common Issues

**Script doesn't run:**
- Is entity in scene?
- Is play mode enabled?
- Is Lua installed? Check startup message.

**Script attaches but no callback:**
- Is the script path correct?
- Check console for error messages
- Ensure function names are lowercase: `onAwake` not `OnAwake`

**Crash or freeze:**
- Check for infinite loops
- Check for missing Lua installation
- Use `engine_log()` to trace execution

---

## Tips & Tricks

### Use Multiple Scripts
- Attach multiple Lua scripts to same entity
- Each runs independently
- Great for organizing behavior

### Project Organization
```
engine/Game/
├── scripts/
│   ├── example.lua
│   ├── my_script.lua
│   ├── player_logic.lua
│   └── enemy_ai.lua
```

### Performance Tips
- Lua is perfect for game logic, input, AI
- Keep calculations simple
- Profile with `engine_log()` to identify slow code

---

## Next Steps

1. **Try creating a script**: Follow Step 1-3 above
2. **Modify the example**: Edit `scripts/example.lua` and see changes immediately
3. **Read the full guide**: See `LUA_SCRIPTING_GUIDE.md` for complete API reference
4. **Build something cool**: Create game logic with Lua!

---

## Complete Documentation

- **Lua Scripting**: See `LUA_SCRIPTING_GUIDE.md`
- **Lua Installation**: See `LUA_INSTALLATION_GUIDE.md`
- **API Reference**: See `LUA_SCRIPTING_GUIDE.md` for bindings

---

## Feedback & Support

- Check documentation files in `Documentation/Scripting/`
- Look at example scripts in `scripts/` directory
- Try modifying `scripts/example.lua`

Happy scripting! 🚀
