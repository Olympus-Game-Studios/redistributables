-- Spinner.lua
-- Test: Rotates the attached entity around the Y axis every frame.
-- Expected: Entity rotates only during Play; original rotation is restored after Stop.

local rotateSpeed = 90.0   -- degrees per second

function onAwake()
    engine_log("[Spinner] onAwake – will rotate at " .. rotateSpeed .. " deg/s")
end

function onEnable()
    engine_log("[Spinner] onEnable")
end

function onUpdate(dt)
    local transform = this:GetTransform()
    if transform then
        transform:Rotate(0, rotateSpeed * dt, 0)
    end
end

function onDisable()
    engine_log("[Spinner] onDisable")
end

function onDestroy()
    engine_log("[Spinner] onDestroy")
end
