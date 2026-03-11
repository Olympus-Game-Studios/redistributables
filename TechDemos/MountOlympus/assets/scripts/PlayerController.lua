-- PlayerController.lua
-- Lua script for Hephaestus Engine

function onAwake()
    print("[PlayerController] Script awakened")
end

function onUpdate(deltaTime)
    -- Main game logic - called every frame
    -- deltaTime is time elapsed since last frame in seconds
end

function onLateUpdate(deltaTime)
    -- Called after onUpdate - useful for post-processing logic
end

function onDestroy()
    print("[PlayerController] Script destroyed")
end
