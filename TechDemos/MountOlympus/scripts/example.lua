-- Example Lua Script for Hephaestus Engine
-- This demonstrates the hybrid C++ + Lua scripting system

-- Lifecycle functions are called by the engine
function onAwake()
    engine_log("MyLuaScript.onAwake() called!")
    
    -- OOP-style API example (using 'this')
    -- local transform = this:GetTransform()
    -- local pos = transform:GetPosition()
    -- engine_log("Position: " .. pos.x .. ", " .. pos.y .. ", " .. pos.z)
end

function onUpdate(deltaTime)
    -- This is called every frame
    -- deltaTime is the time elapsed since last frame in seconds
    engine_log("onUpdate called with dt=" .. tostring(deltaTime))
    
    -- You can use either API style:
    
    -- STYLE 1: OOP-style (using 'this' and method calls)
    -- local transform = this:GetTransform()
    -- local pos = transform:GetPosition()
    -- transform:SetPosition({x = pos.x, y = pos.y + 0.1 * deltaTime, z = pos.z})
    
    -- STYLE 2: Functional-style (using global Transform table)
    -- local pos = Transform.getPosition()
    -- Transform.setPosition(pos.x, pos.y + 0.1 * deltaTime, pos.z)
end

function onLateUpdate(deltaTime)
    engine_log("onLateUpdate called")
end

function onDestroy()
    engine_log("MyLuaScript destroyed")
end

-- You can also define your own functions
function myCustomFunction()
    engine_log("Custom function called!")
end

-- Game logic example
local moveSpeed = 5.0
local rotationSpeed = 2.0

function updateMovement(deltaTime)
    -- Get input (when Input bindings are complete)
    -- local moving = Input.isKeyPressed("W")
    -- Move entity, update animation, etc.
    engine_log("Movement updated")
end
