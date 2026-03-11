-- ═══════════════════════════════════════════════════════════════════════════
-- Camera Controller Example Script
-- Demonstrates CameraActor features:
--   - Moving the camera transform over time
--   - Switching active camera on key press
--   - Accessing camera properties (FOV, near/far clip)
-- ═══════════════════════════════════════════════════════════════════════════

-- Script variables (can be exposed in editor)
local moveSpeed = 5.0
local rotateSpeed = 1.0
local switchCooldown = 0.5  -- Seconds between camera switches
local lastSwitchTime = 0

-- Called once when the entity is created
function onAwake()
    print("[CameraController] Camera actor initialized")
    
    -- Get this entity's camera component (if it has one)
    local cam = this:GetCamera()
    if cam then
        print("[CameraController] FOV: " .. cam:GetFov())
        print("[CameraController] Near: " .. cam:GetNear())
        print("[CameraController] Far: " .. cam:GetFar())
        print("[CameraController] Active: " .. tostring(cam:IsActive()))
    else
        print("[CameraController] This entity does not have a CameraComponent")
    end
end

-- Called every frame during play mode
function onUpdate(dt)
    local transform = this:GetTransform()
    if not transform then return end
    
    -- ═══════════════════════════════════════════════════════════════
    -- CAMERA MOVEMENT (attach to camera entity for first-person control)
    -- ═══════════════════════════════════════════════════════════════
    
    -- Forward/backward movement (W/S keys via Camera global)
    if Input.isKeyPressed("W") then
        Camera.translate(0, 0, -moveSpeed * dt)
    end
    if Input.isKeyPressed("S") then
        Camera.translate(0, 0, moveSpeed * dt)
    end
    
    -- Strafe left/right (A/D keys)
    if Input.isKeyPressed("A") then
        Camera.translate(-moveSpeed * dt, 0, 0)
    end
    if Input.isKeyPressed("D") then
        Camera.translate(moveSpeed * dt, 0, 0)
    end
    
    -- Vertical movement (Q/E keys)
    if Input.isKeyPressed("Q") then
        Camera.translate(0, -moveSpeed * dt, 0)
    end
    if Input.isKeyPressed("E") then
        Camera.translate(0, moveSpeed * dt, 0)
    end
    
    -- ═══════════════════════════════════════════════════════════════
    -- CAMERA SWITCHING (press C to cycle cameras)
    -- ═══════════════════════════════════════════════════════════════
    
    lastSwitchTime = lastSwitchTime + dt
    
    if Input.isKeyPressed("C") and lastSwitchTime > switchCooldown then
        lastSwitchTime = 0
        switchToNextCamera()
    end
    
    -- ═══════════════════════════════════════════════════════════════
    -- DYNAMIC FOV (press F to toggle between 60 and 90 FOV)
    -- ═══════════════════════════════════════════════════════════════
    
    if Input.isKeyPressed("F") then
        local cam = this:GetCamera()
        if cam then
            local currentFov = cam:GetFov()
            if currentFov < 75 then
                cam:SetFov(90)
                print("[CameraController] FOV set to 90 (wide)")
            else
                cam:SetFov(60)
                print("[CameraController] FOV set to 60 (normal)")
            end
        end
    end
end

-- Called after all onUpdate calls have finished
function onLateUpdate(dt)
    -- LateUpdate is useful for camera follow logic
    -- (e.g., following a player character after their movement)
end

-- Switch to the next camera in the scene
function switchToNextCamera()
    local cameras = Scene.FindCameras()
    if #cameras == 0 then
        print("[CameraController] No cameras in scene")
        return
    end
    
    if #cameras == 1 then
        print("[CameraController] Only one camera in scene")
        return
    end
    
    -- Find currently active camera
    local activeCamera = Scene.GetActiveCamera()
    local activeIndex = 0
    
    for i, cam in ipairs(cameras) do
        if cam == activeCamera then
            activeIndex = i
            break
        end
    end
    
    -- Switch to next camera (wrap around)
    local nextIndex = (activeIndex % #cameras) + 1
    local nextCamera = cameras[nextIndex]
    
    Scene.SetActiveCamera(nextCamera)
    
    local nextName = nextCamera:GetName()
    print("[CameraController] Switched to camera: " .. (nextName or "Unknown"))
end

-- Called when this entity is destroyed
function onDestroy()
    print("[CameraController] Camera controller destroyed")
end
