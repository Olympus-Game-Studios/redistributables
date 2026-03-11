-- fp-controller.lua
-- First-person player controller (Lua) for Hephaestus Engine.
--
-- Notes / limitations:
-- - The current Lua runtime bindings expose Transform/Entity/Input/Time/Camera.
-- - There is no physics/raycast API exposed to Lua yet, so "gravity" here is
--   simulated and resolved against a configurable ground plane (groundY).
--
-- Controls:
-- - WASD: move
-- - Shift: sprint
-- - Space: jump
-- - Mouse: look (hold RMB if requireRightMouse=true)

local config = {
	moveSpeed = 6.0,
	sprintMultiplier = 1.8,
	lookSensitivity = 0.0035,
	maxPitch = math.rad(89.0),
	requireRightMouse = true,

	-- Use Jolt physics via Lua bindings when available.
	usePhysics = true,

	-- Camera
	cameraOffsetY = 1,

	-- Gravity / jump
	gravity = -30.0,        -- units/s^2
	jumpSpeed = 1.5,        -- units/s
	maxFallSpeed = -55.0,   -- clamp terminal velocity

	-- Ground plane (until physics binding exists)
	groundY = 0.0,
	groundSnapEpsilon = 0.02,

	-- Physics grounding probe
	groundProbeStartOffsetY = 0.15, -- start ray slightly above body origin
	groundProbeDistance = 0.6,      -- how far down to test for ground
	groundedDistance = 0.2,         -- considered grounded within this distance

	-- Physics movement tuning
	groundStickVelocity = -1.5,
	jumpPower = 4.5,

	-- Keep player upright (lock pitch/roll)
	lockUpright = true,
}

local state = {
	yaw = 0.0,
	pitch = 0.0,
	lastMouseX = nil,
	lastMouseY = nil,

	grounded = false,
	verticalVelocity = 0.0,
	jumpWasDown = false,

	cameraActive = false,
}

local function physicsAvailable()
	return config.usePhysics
		and Physics
		and Physics.isAvailable
		and Physics.isAvailable()
		and Physics.hasBody
		and Physics.hasBody()
end

local function normalize2(x, z)
	local lengthSq = x * x + z * z
	if lengthSq < 1e-5 then
		return 0.0, 0.0
	end
	local invLen = 1.0 / math.sqrt(lengthSq)
	return x * invLen, z * invLen
end

local function getMoveInput()
	local x = 0.0
	local z = 0.0

	if Input.isKeyPressed("A") then x = x - 1.0 end
	if Input.isKeyPressed("D") then x = x + 1.0 end
	if Input.isKeyPressed("W") then z = z - 1.0 end
	if Input.isKeyPressed("S") then z = z + 1.0 end

	x, z = normalize2(x, z)

	local isSprinting = Input.isKeyPressed("LEFT_SHIFT") or Input.isKeyPressed("RIGHT_SHIFT")
	local speed = config.moveSpeed * (isSprinting and config.sprintMultiplier or 1.0)
	return x, z, speed
end

local function applyMouseLook()
	if config.requireRightMouse and not Input.isMouseButtonPressed("RIGHT") then
		state.lastMouseX = nil
		state.lastMouseY = nil
		return
	end

	local mouse = Input.getMousePosition()
	if not mouse then
		return
	end

	if state.lastMouseX == nil then
		state.lastMouseX = mouse.x
		state.lastMouseY = mouse.y
		return
	end

	local deltaX = mouse.x - state.lastMouseX
	local deltaY = mouse.y - state.lastMouseY

	state.lastMouseX = mouse.x
	state.lastMouseY = mouse.y

	state.yaw = state.yaw - deltaX * config.lookSensitivity
	state.pitch = state.pitch - deltaY * config.lookSensitivity

	if state.pitch > config.maxPitch then state.pitch = config.maxPitch end
	if state.pitch < -config.maxPitch then state.pitch = -config.maxPitch end

	-- For FPS, keep body yaw-only; pitch is applied to camera.
	Transform.setRotation(0.0, state.yaw, 0.0)
	if physicsAvailable() and Physics.setRotation then
		Physics.setRotation(0.0, state.yaw, 0.0, true)
	end
end

local function computeHorizontalVelocity(deltaTime)
	local x, z, speed = getMoveInput()
	if x == 0.0 and z == 0.0 then
		return 0.0, 0.0
	end

	-- Match the sample controller convention:
	-- yaw=0 -> forward is +X, right is +Z.
	local forwardX = math.cos(state.yaw)
	local forwardZ = math.sin(state.yaw)
	local rightX = -math.sin(state.yaw)
	local rightZ = math.cos(state.yaw)

	local velX = (rightX * x + forwardX * z) * speed
	local velZ = (rightZ * x + forwardZ * z) * speed
	return velX, velZ
end

local function moveHorizontal(deltaTime)
	local velX, velZ = computeHorizontalVelocity(deltaTime)
	if physicsAvailable() and Physics.getLinearVelocity and Physics.setLinearVelocity then
		local vel = Physics.getLinearVelocity()
		if vel then
			-- Set horizontal velocity directly, preserve vertical
			local newY = vel.y
			if state.grounded and newY < config.groundStickVelocity then
				newY = config.groundStickVelocity
			end
			Physics.setLinearVelocity(velX, newY, velZ, true)
			return
		end
	end

	if velX == 0.0 and velZ == 0.0 then
		return
	end

	-- Fallback: direct transform movement
	Transform.translate(velX * deltaTime, 0.0, velZ * deltaTime)
end

local function updateGroundedPhysics()
	state.grounded = false
	if not physicsAvailable() or not Physics.raycast then
		return false
	end

	local pos = Transform.getPosition()
	if not pos then
		return false
	end

	-- Raycast from below body center downward
	local startY = pos.y - 0.5
	local hit = Physics.raycast(pos.x, startY, pos.z, 0.0, -1.0, 0.0, config.groundProbeDistance)
	if not hit or not hit.hit then
		return false
	end

	if hit.distance <= config.groundedDistance then
		state.grounded = true
	end

	return state.grounded
end

local function updateJumpPhysics()
	local jumpDown = Input.isKeyPressed("SPACE")
	local jumpPressed = jumpDown and not state.jumpWasDown
	state.jumpWasDown = jumpDown

	if not physicsAvailable() or not Physics.getLinearVelocity or not Physics.setLinearVelocity then
		return false
	end

	if jumpPressed and state.grounded then
		local vel = Physics.getLinearVelocity()
		if vel then
			Physics.setLinearVelocity(vel.x, config.jumpPower, vel.z, true)
			state.grounded = false
			return true
		end
	end
	return false
end

local function resolveGround(pos)
	if not pos then
		state.grounded = false
		return nil
	end

	local distanceToGround = pos.y - config.groundY
	if distanceToGround <= config.groundSnapEpsilon then
		state.grounded = true
		if pos.y < config.groundY then
			pos.y = config.groundY
		end
		if state.verticalVelocity < 0.0 then
			state.verticalVelocity = 0.0
		end
	else
		state.grounded = false
	end

	return pos
end

local function updateGravityAndJump(deltaTime)
	local pos = Transform.getPosition()
	pos = resolveGround(pos)
	if not pos then
		return
	end

	local wantsJump = Input.isKeyPressed("SPACE")
	if wantsJump and state.grounded then
		state.verticalVelocity = config.jumpSpeed
		state.grounded = false
	end

	if not state.grounded then
		state.verticalVelocity = state.verticalVelocity + config.gravity * deltaTime
		if state.verticalVelocity < config.maxFallSpeed then
			state.verticalVelocity = config.maxFallSpeed
		end
		pos.y = pos.y + state.verticalVelocity * deltaTime
		Transform.setPosition(pos.x, pos.y, pos.z)

		-- Re-resolve in case we landed this frame
		pos = Transform.getPosition()
		pos = resolveGround(pos)
		if pos then
			Transform.setPosition(pos.x, pos.y, pos.z)
		end
	else
		-- Keep feet on the ground plane (helps prevent tiny float drift)
		if pos.y ~= config.groundY then
			Transform.setPosition(pos.x, config.groundY, pos.z)
		end
	end
end

local function updateCamera()
	if not Camera or not Camera.setPosition or not state.cameraActive then
		return
	end

	local pos = Transform.getPosition()
	if not pos then
		return
	end

	Camera.setPosition(pos.x, pos.y + config.cameraOffsetY, pos.z)
	if Camera.setRotation then
		Camera.setRotation(state.pitch, state.yaw, 0.0)
	end
end

local function maintainUpright()
	if not config.lockUpright then
		return
	end

	if physicsAvailable() and Physics.setRotation then
		Physics.setRotation(0.0, state.yaw, 0.0, true)
		if Physics.setAngularVelocity then
			Physics.setAngularVelocity(0.0, 0.0, 0.0, true)
		end
	else
		Transform.setRotation(0.0, state.yaw, 0.0)
	end
end

function onAwake()
	local rot = Transform.getRotation()
	if rot then
		state.pitch = rot.x or 0.0
		state.yaw = rot.y or 0.0
	end

	-- Apply initial yaw-only to body
	Transform.setRotation(0.0, state.yaw, 0.0)
	if physicsAvailable() and Physics.setRotation then
		Physics.setRotation(0.0, state.yaw, 0.0, true)
	end

	local pos = Transform.getPosition()
	if pos then
		resolveGround(pos)
		if state.grounded then
			Transform.setPosition(pos.x, config.groundY, pos.z)
		end
	end

	local name = Entity.getName() or "Player"
	Entity.setName(name .. " [FP Lua]")
	engine_log("[fp-controller.lua] Ready - WASD move, Space jump, hold RMB to look")

	if Camera and Camera.setActive then
		Camera.setActive(true)
		state.cameraActive = true
		updateCamera()
	end
end

function onEnable()
	state.lastMouseX = nil
	state.lastMouseY = nil
	if Camera and Camera.setActive then
		Camera.setActive(true)
		state.cameraActive = true
		updateCamera()
	end
end

function onUpdate(deltaTime)
	deltaTime = deltaTime or Time.deltaTime()
	if not deltaTime or deltaTime <= 0.0 then
		return
	end

	if physicsAvailable() then
		updateGroundedPhysics()
	end

	applyMouseLook()
	moveHorizontal(deltaTime)
	maintainUpright()

	if physicsAvailable() then
		updateJumpPhysics()
	else
		updateGravityAndJump(deltaTime)
	end
	updateCamera()
end

function onDisable()
	state.lastMouseX = nil
	state.lastMouseY = nil
	if state.cameraActive and Camera and Camera.setActive then
		Camera.setActive(false)
	end
	state.cameraActive = false
end

function onDestroy()
	state.lastMouseX = nil
	state.lastMouseY = nil
	if state.cameraActive and Camera and Camera.setActive then
		Camera.setActive(false)
	end
	state.cameraActive = false
end

