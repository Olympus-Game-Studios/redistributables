-- UpDownRotate.lua
-- Lua script for Hephaestus Engine
-- Makes the object bob up and down subtly while rotating

-- Configuration
local BOB_SPEED = 0.5          -- Speed of bobbing motion (Hz)
local BOB_HEIGHT = 0.5         -- Height of bob movement (units)
local ROTATION_SPEED = 0.002     -- Rotation speed (lower = slower semi-circle)

-- Internal state
local transform = nil
local initialPosition = nil
local elapsedTime = 0

function onAwake()
    print("[UpDownRotate] Script awakened")
    -- Get the transform component
    transform = this:GetTransform()
    -- Store the initial position (make a copy to be safe)
    local pos = transform:GetPosition()
    initialPosition = {x = pos.x, y = pos.y, z = pos.z}
    elapsedTime = 0
end

function onUpdate(deltaTime)
    -- Main game logic - called every frame
    -- deltaTime is time elapsed since last frame in seconds
    
    elapsedTime = elapsedTime + deltaTime
    
    -- Calculate bobbing motion using sine wave
    local bobOffset = math.sin(elapsedTime * BOB_SPEED * math.pi * 2) * BOB_HEIGHT
    
    -- Calculate rotation (semi-circle: oscillates between 0 and 180 degrees)
    local rotationAmount = math.sin(elapsedTime * ROTATION_SPEED * math.pi) * 90
    
    -- Apply new position (bob up and down)
    -- Create a new position based on initial position plus bob offset
    local newPosition = {
        x = initialPosition.x,
        y = initialPosition.y + bobOffset,
        z = initialPosition.z
    }
    transform:SetPosition(newPosition)
    
    -- Apply rotation around Y axis
    local currentRotation = transform:GetRotation()
    currentRotation.y = rotationAmount  -- Semi-circle rotation (±90 degrees)
    transform:SetRotation(currentRotation)
end

function onLateUpdate(deltaTime)
    -- Called after onUpdate - useful for post-processing logic
end

function onDestroy()
    print("[UpDownRotate] Script destroyed")
end