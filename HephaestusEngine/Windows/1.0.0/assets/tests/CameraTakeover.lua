-- CameraTakeover.lua
-- Test: Lua script that takes full camera control via Camera.setActive(true).
-- Expected: WASD moves camera during Play, mouse rotates camera.
--           Camera stops on Stop, editor fly camera is restored.
--
-- Lifecycle: onAwake -> onEnable -> onUpdate(dt) -> onLateUpdate(dt)
--            onDisable (on stop) -> onDestroy (on stop)

local moveSpeed   = 5.0
local lookSpeed   = 0.003   -- radians per pixel

function onAwake()
    engine_log("[CameraTakeover] onAwake – taking camera control")
    Camera.setActive(true)
end

function onEnable()
    engine_log("[CameraTakeover] onEnable")
end

function onUpdate(dt)
    -- Movement (WASD + QE)
    local dx, dy, dz = 0, 0, 0

    if Input.isKeyPressed("W") then dz = dz - moveSpeed * dt end
    if Input.isKeyPressed("S") then dz = dz + moveSpeed * dt end
    if Input.isKeyPressed("A") then dx = dx - moveSpeed * dt end
    if Input.isKeyPressed("D") then dx = dx + moveSpeed * dt end
    if Input.isKeyPressed("E") then dy = dy + moveSpeed * dt end
    if Input.isKeyPressed("Q") then dy = dy - moveSpeed * dt end

    if dx ~= 0 or dy ~= 0 or dz ~= 0 then
        -- Get current rotation to compute forward/right vectors
        local pitch, yaw, roll = Camera.getRotation()

        local cosPitch = math.cos(pitch)
        local sinPitch = math.sin(pitch)
        local cosYaw   = math.cos(yaw)
        local sinYaw   = math.sin(yaw)

        -- Forward vector (negative Z in view space)
        local forwardX = cosPitch * cosYaw
        local forwardY = sinPitch
        local forwardZ = cosPitch * sinYaw

        -- Right vector
        local rightX = -sinYaw
        local rightY = 0
        local rightZ = cosYaw

        -- Build world-space translation
        local moveX = rightX * dx + forwardX * dz
        local moveY = dy + forwardY * dz
        local moveZ = rightZ * dx + forwardZ * dz

        Camera.translate(moveX, moveY, moveZ)
    end
end

function onLateUpdate(dt)
    -- Mouse look (only when right mouse button held, or always – user preference)
    if Input.isMouseButtonPressed("RIGHT") then
        local mx, my = Input.getMousePosition()
        -- Delta is not directly available; for a real implementation you'd track
        -- the previous position. This is a minimal test stub.
    end
end

function onDisable()
    engine_log("[CameraTakeover] onDisable – releasing camera")
    Camera.setActive(false)
end

function onDestroy()
    engine_log("[CameraTakeover] onDestroy")
end
