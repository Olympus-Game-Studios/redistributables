# Lua Integration Roadmap

This document outlines the remaining steps to complete Lua scripting integration in Hephaestus Engine.

## Status Summary

### Completed ✓
- [x] Lua infrastructure in CMakeLists.txt (optional, graceful fallback)
- [x] LuaScriptEngine.h/cpp with placeholder implementations
- [x] LuaScriptComponent for ECS integration
- [x] Conditional compilation guards for missing Lua
- [x] LUA_INSTALLATION_GUIDE.md for end-users
- [x] LUA_SCRIPTING_GUIDE.md for scripting reference
- [x] Build succeeds without Lua installed
- [x] Entity/Transform/Input Lua bindings (first-pass implementation)
- [x] LuaScriptEngine initialization wired into main.cpp
- [x] Lua lifecycle hooks hooked into play/update/late-update loops
- [x] Verified Lua script attachment via Details Panel (example script)

### In Progress 🟡
- [ ] Expand Entity bindings (component access, add/remove components)
- [ ] Scene query helpers (find by tag, raycasts)
- [ ] Hot reload and error UI improvements

### Implementation Details

## Phase 1: Lua Binding Enhancements

Baseline bindings (Transform, Entity naming, Input, Time) are implemented in `LuaScriptEngine.cpp`. Remaining work focuses on richer game-facing APIs:

### 1. Entity Bindings
```cpp
// Target Lua API:
entity:getPosition()           -- Returns {x, y, z}
entity:setPosition(x, y, z)    -- Sets position
entity:getRotation()           -- Returns {x, y, z} in radians
entity:setRotation(x, y, z)    -- Sets rotation
entity:getScale()              -- Returns {x, y, z}
entity:setScale(x, y, z)       -- Sets scale
entity:addComponent(type)      -- Attach component by name
entity:hasComponent(type)      -- Check if has component
entity:removeComponent(type)   -- Detach component
```

**Implementation Challenge**:
- Map string component names to actual types safely
- Provide userdata wrappers for richer interactions without exposing raw pointers
- Gracefully handle invalid entities / missing components

### 2. Transform Bindings
```cpp
// Target Lua API:
Transform.setPosition(entity, x, y, z)
Transform.getPosition(entity)
Transform.rotate(entity, x, y, z)    -- Rotate in euler angles
Transform.scale(entity, x, y, z)
Transform.translate(entity, x, y, z) -- Move relative to current position
```

### 3. Input Bindings
```cpp
// Target Lua API:
Input.isKeyPressed(key)        -- "W", "A", "S", "D", "Space", etc.
Input.isKeyDown(key)
Input.isKeyReleased(key)
Input.getMousePosition()       -- Returns {x, y}
Input.isMouseButtonPressed(button)  -- 0=left, 1=right, 2=middle
```

**Challenge**: Input state from engine core needs to be accessible during Lua execution

## Phase 2: Main Loop Integration

### Location: `engine/Core/main.cpp`

**Steps**:
1. Add global LuaScriptEngine instance (around line 130-150)
2. Initialize LuaScriptEngine after ScriptEngine (after line 3215)
3. Add Lua update calls to main render loop:
   - Call onAwake for all new entities with LuaScriptComponent
   - Call onUpdate during play mode (around line 4083-4086)
   - Call onLateUpdate after other updates
   - Call onDestroy when entities are deleted

**Code Structure**:
```cpp
// Global
LuaScriptEngine g_LuaScriptEngine;

// In main loop initialization
g_LuaScriptEngine.Initialize(&g_Scene);

// In render loop
if (g_SimPlaying && !g_SimPaused) {
    // Update Lua scripts
    for (auto entity : g_Scene.GetRegistry().view<LuaScriptComponent>()) {
        Entity e(entity, &g_Scene);
        auto& lua_component = g_Scene.GetRegistry().get<LuaScriptComponent>(entity);
        
        // Execute Lua callbacks
        g_LuaScriptEngine.CallEntityFunction("onUpdate", e, deltaTime);
    }
}
```

## Phase 3: Testing

### Test Plan:
1. Create simple Lua script with onAwake, onUpdate, onDestroy
2. Attach to entity via Details Panel UI
3. Run in play mode
4. Verify all callbacks execute
5. Test each binding (Transform, Input, Entity)

### Test Script: `engine/Game/scripts/test_lua.lua`
```lua
function onAwake()
    engine_log("Lua script started on entity")
end

function onUpdate(deltaTime)
    -- Test transform binding
    local pos = Transform.getPosition()
    -- Test input binding
    if Input.isKeyPressed("W") then
        Transform.translate(0, 0, 5 * deltaTime)
    end
end

function onDestroy()
    engine_log("Lua script destroyed")
end
```

## Phase 4: Documentation Updates

- [ ] Update README.md with Lua support section
- [ ] Add code examples to LUA_SCRIPTING_GUIDE.md
- [ ] Create troubleshooting section in LUA_INSTALLATION_GUIDE.md
- [ ] Add Lua bindings reference documentation

## Key Design Decisions

### 1. Userdata vs Tables
- **Current approach**: Lua tables {x, y, z} for simple values
- **Future approach**: Userdata with metatables for persistent object references

### 2. Entity Lifecycle
- Lua scripts load on entity creation (not startup)
- Callbacks execute per-frame during play mode
- Scripts destroyed when entity is destroyed

### 3. Performance Considerations
- Lua replaces C++ script updates (C++ scripting deprecated)
- Hot-reload: Restart simulation to load script changes
- No script debugging yet (could add Lua debugger protocol support)

## Files to Modify

1. **engine/Scripting/LuaScriptEngine.cpp**
    - Expand Entity/component bindings (userdata/exposed APIs)
    - Add scene query helpers and hot-reload support
    - Improve error reporting surfaced to the editor UI

2. **engine/Core/main.cpp**
    - Hook hot-reload triggers (file watchers) when implemented
    - Surface Lua errors/warnings in the editor console overlay

3. **Documentation**
    - README, guides, and troubleshooting sections highlighting Lua workflow

## Estimated Timeline

- **Phase 1 (Bindings)**: 2-3 hours (complex C API usage)
- **Phase 2 (Integration)**: 1 hour (glue code)
- **Phase 3 (Testing)**: 1 hour (verification)
- **Phase 4 (Docs)**: 30 minutes (documentation)

**Total**: ~4-5 hours for complete Lua scripting support

## Next Steps

1. Broaden Entity/component bindings (userdata helpers, component access)
2. Add Scene query utilities exposed to Lua
3. Implement hot-reload + richer error surfacing
4. Continue expanding documentation and troubleshooting guides
