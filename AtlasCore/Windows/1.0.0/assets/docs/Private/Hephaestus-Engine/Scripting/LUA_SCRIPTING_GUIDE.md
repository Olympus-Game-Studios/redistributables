# Hephaestus Engine: Lua Scripting Guide

## Overview

Hephaestus uses **Lua** as its primary scripting language. Lua provides:

- **Fast iteration** - Changes take effect instantly, no recompilation
- **Easy syntax** - Beginner-friendly, similar to Python
- **Great performance** - Plenty fast for gameplay logic
- **Rich API** - Access to transform, input, camera, and more

This is the complete guide to scripting in Hephaestus Engine. For a 5-minute quick start, see [SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md).

**Note**: C++ scripting has been removed. C# scripting support is planned for future releases.

## Quick Start

### 1. Create a Lua Script

Create a file `scripts/MyGame.lua`:

```lua
-- Called when the script is attached to an entity
function onAwake()
    engine_log("MyGame script started!")
end

-- Called every frame
function onUpdate(deltaTime)
    engine_log("Frame time: " .. tostring(deltaTime))
end

-- Custom functions
function handleCollision(other)
    engine_log("Collided with something!")
end
```

### 2. Attach via Editor

1. Select an entity
2. Details Panel → Scripts
3. Select your `.lua` file in Asset Browser
4. Click "Attach"

### 3. Run

Enter play mode - your Lua script runs automatically!

## Lifecycle Callbacks

Lua scripts support these lifecycle functions:

```lua
-- Called once when script initializes
function onAwake()
end

-- Called every frame
function onUpdate(deltaTime)
end

-- Called after all updates (for camera/post-processing)
function onLateUpdate(deltaTime)
end

-- Called when script is destroyed
function onDestroy()
end

-- Called when entity is enabled
function onEnable()
end

-- Called when entity is disabled
function onDisable()
end

-- Physics collisions (when implemented)
function onTriggerEnter(other)
end

function onTriggerStay(other)
end

function onTriggerExit(other)
end
```

`onAwake` runs once when the script is first loaded for play; `onEnable` is invoked immediately afterwards and whenever a disabled script is re-enabled. `onDisable` and `onDestroy` fire when play mode stops, the script is detached, or the entity is removed.

## C++ Bindings

Hephaestus supports two API styles for accessing entity data:

1. **OOP-style** (recommended): Use `this` to access the current entity and its components
2. **Functional-style**: Use global tables like `Transform`, `Entity`, `Input`

### Logging

```lua
engine_log("This message appears in console")
```

### OOP-Style API (using `this`)

The `this` global represents the entity the script is attached to:

```lua
function onAwake()
    -- Get the transform component
    local transform = this:GetTransform()
    
    -- Get current position
    local pos = transform:GetPosition()
    print(pos.x, pos.y, pos.z)
    
    -- Set new position (using a table)
    transform:SetPosition({x = 1.0, y = 2.0, z = 3.0})
    
    -- Or set position with individual values
    transform:SetPosition(1.0, 2.0, 3.0)
    
    -- Get entity name
    local name = this:GetName()
    this:SetName(name .. " (Lua)")
end

function onUpdate(deltaTime)
    local transform = this:GetTransform()
    
    -- Rotate over time
    local rotation = transform:GetRotation()
    rotation.y = rotation.y + 45.0 * deltaTime
    transform:SetRotation(rotation)
    
    -- Or use relative methods
    transform:Rotate(0, 45.0 * deltaTime, 0)
    transform:Translate(0, 0, 5.0 * deltaTime)
end
```

**`this` methods:**

- `this:GetTransform()` → returns a transform object
- `this:GetName()` → `string|nil`
- `this:SetName(name)`
- `this:IsValid()` → `boolean`

**Transform object methods:**

- `transform:GetPosition()` → `{ x, y, z }`
- `transform:SetPosition(pos)` or `transform:SetPosition(x, y, z)`
- `transform:Translate(dx, dy, dz)` (relative move)
- `transform:GetRotation()` → `{ x, y, z }` (degrees)
- `transform:SetRotation(rot)` or `transform:SetRotation(rx, ry, rz)`
- `transform:Rotate(rx, ry, rz)` (relative rotation)
- `transform:GetScale()` → `{ x, y, z }`
- `transform:SetScale(scale)` or `transform:SetScale(sx, sy, sz)`

### Functional-Style API (Global Tables)

Alternatively, use global tables that operate on the current entity:

```lua
-- Get entity position
local pos = Transform.getPosition()
print(pos.x, pos.y, pos.z)

-- Set entity position
Transform.setPosition(1.0, 2.0, 3.0)

-- Rotate entity
Transform.rotate(0, 1.5, 0)

-- Get/set scale
Transform.setScale(1.0, 1.0, 1.0)
```

Available helpers:

- `Transform.getPosition()` → `{ x, y, z }`
- `Transform.setPosition(x, y, z)`
- `Transform.translate(dx, dy, dz)` (relative move)
- `Transform.getRotation()` / `Transform.setRotation(rx, ry, rz)` (degrees)
- `Transform.rotate(rx, ry, rz)` (relative rotation)
- `Transform.getScale()` / `Transform.setScale(sx, sy, sz)`

### Entity

```lua
if Entity.isValid() then
    local name = Entity.getName() or "Entity"
    Entity.setName(name .. " (Lua)")
end
```

Available helpers:

- `Entity.isValid()` → `boolean`
- `Entity.getName()` → `string|nil`
- `Entity.setName(name)`

### Input

```lua
if Input.isKeyPressed("W") then
    engine_log("W key pressed!")
end

if Input.isMouseButtonPressed(0) then
    engine_log("Left mouse button down")
end

-- Get mouse position
local mouse = Input.getMousePosition()
if mouse then
    engine_log(string.format("Mouse position: %.0f %.0f", mouse.x, mouse.y))
end
```

Available helpers:

- `Input.isKeyPressed(key)` → `boolean` (string name or key code)
- `Input.isMouseButtonPressed(button)` → `boolean`
- `Input.getMousePosition()` → `{ x, y }` (window pixels)
- `Input.getMousePosition()` → `{ x, y }` (window pixels)

### Camera

```lua
Camera.setActive(true)
Camera.setPosition(0.0, 1.6, 0.0)
Camera.setRotation(math.rad(0.0), math.rad(180.0), 0.0)
```

- `Camera.setActive(enabled)` → enable manual control from scripts (auto-disabled on stop)
- `Camera.isActive()` → `boolean`
- `Camera.setPosition(x, y, z)` / `Camera.getPosition()`
- `Camera.translate(dx, dy, dz)` → offsets camera in world space
- `Camera.setRotation(rx, ry, rz)` / `Camera.getRotation()` (radians, pitch/yaw/roll)

### Time

```lua
local dt = Time.deltaTime()
```

Use `Time.deltaTime()` whenever you need the most recent frame delta outside of `onUpdate` parameters (for example inside utility modules).

### Scene Queries (Coming Soon)

```lua
-- Find all entities with a tag
local entities = scene:findEntitiesWithTag("Enemy")

-- Get entity by name
local player = scene:findEntityByName("Player")

-- Cast rays
local hit, distance = scene:raycast(origin, direction, maxDistance)
```

## Performance Considerations

- **Lua is ideal for**: Game logic, UI, AI, event handling, input processing
- **Lua is not ideal for**: Tight rendering loops, heavy physics calculations
- **Performance**: ~100x slower than native code, but still very fast for gameplay
- Call C++ from Lua (planned) for performance-critical operations
- Avoid tight loops in Lua - keep them simple

## Best Practices

### ✅ Good Lua Usage
```lua
-- Game logic
function onUpdate(dt)
    -- Check conditions
    if shouldJump() then
        -- Call C++ for physics
        Player.jump()
    end
end

-- Event handling
function onItemCollected(item)
    Inventory.add(item)
    UI.updateDisplay()
end
```

### ❌ Avoid in Lua
```lua
-- DON'T: Tight render loop
for i=1,1000000 do
    -- Complex math
end

-- DON'T: Heavy physics calculations every frame
for i=1,10000 do
    -- Physics calculations
end
```

## Complete Script Example

Here's a full example using the OOP-style API to make an entity bob up and down while rotating:

```lua
-- UpDownRotate.lua
-- Makes the object bob up and down subtly while rotating

-- Configuration
local BOB_SPEED = 2.0          -- Speed of bobbing motion (Hz)
local BOB_HEIGHT = 0.5         -- Height of bob movement (units)
local ROTATION_SPEED = 45.0    -- Rotation speed (degrees per second)

-- Internal state
local transform = nil
local initialPosition = nil
local elapsedTime = 0

function onAwake()
    print("[UpDownRotate] Script awakened")
    -- Get the transform component
    transform = this:GetTransform()
    -- Store the initial position
    local pos = transform:GetPosition()
    initialPosition = {x = pos.x, y = pos.y, z = pos.z}
    elapsedTime = 0
end

function onUpdate(deltaTime)
    elapsedTime = elapsedTime + deltaTime
    
    -- Calculate bobbing motion using sine wave
    local bobOffset = math.sin(elapsedTime * BOB_SPEED * math.pi * 2) * BOB_HEIGHT
    
    -- Calculate rotation
    local rotationAmount = elapsedTime * ROTATION_SPEED
    
    -- Apply new position (bob up and down)
    local newPosition = {
        x = initialPosition.x,
        y = initialPosition.y + bobOffset,
        z = initialPosition.z
    }
    transform:SetPosition(newPosition)
    
    -- Apply rotation around Y axis
    local currentRotation = transform:GetRotation()
    currentRotation.y = rotationAmount % 360
    transform:SetRotation(currentRotation)
end

function onDestroy()
    print("[UpDownRotate] Script destroyed")
end
```

## Hybrid Example

`scripts/Player.lua` - Game logic in Lua:
```lua
local speed = 5.0

function onUpdate(dt)
    if Input.isKeyPressed("W") then
        local transform = this:GetTransform()
        transform:Translate(speed * dt, 0, 0)
    end
end
```

This approach lets you write all gameplay logic in Lua while keeping engine systems in C++.

## Hot-Reload

(Planned) Save a Lua file while game is running → automatically reload without restarting game.

## Debugging (Planned)

- Breakpoints
- Variable watches
- Step through code
- Profiler integration

## Troubleshooting

**"Lua script not found"**
- Check file path is correct
- File must have `.lua` extension
- Must be in project assets or workspace scripts directory

**"Function not defined"**
- Lua functions must be defined at global scope
- Check spelling (Lua is case-sensitive)
- Avoid local functions at module level

**"Script runs slow"**
- Profile with `engine_log()` to measure frame time
- Move heavy calculations to C++
- Reduce number of script updates per frame

## Future Roadmap

- [ ] Full Entity/Component bindings
- [ ] Scene query functions
- [ ] Input system bindings
- [ ] Coroutines for time-based logic
- [ ] Hot-reload during gameplay
- [ ] Lua debugger integration
- [ ] Profiler for Lua code
- [ ] Precompiled Lua (bytecode) support
