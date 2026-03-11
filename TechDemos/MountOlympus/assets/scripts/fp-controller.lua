-- fp-controller-blueprint.lua
-- First-person controller intended for a Blueprint that includes:
--  - Capsule mesh (this entity)
--  - Separate Camera actor (Scene camera entity)
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
	requireRightMouse = false,

	-- Use Jolt physics via Lua bindings when available.
	usePhysics = true,
	allowTransformFallback = true,

	-- Camera follow settings
	cameraOffsetY = 1.2,
	cameraOffsetZ = 0.0,

	-- Optional: target a specific camera by name (leave empty to use first camera)
	cameraName = "",

	-- Gravity / jump
	gravity = -30.0,
	jumpSpeed = 1.5,
	maxFallSpeed = -55.0,

	-- Ground plane (fallback if physics isn't available)
	groundY = 0.0,
	groundSnapEpsilon = 0.02,

	-- Physics grounding probe
	groundProbeDistance = 0.6,
	groundedDistance = 0.2,

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
	cameraEntity = nil,
	physicsRuntimeEnabled = false,
	warnedNoPhysicsApi = false,
	warnedNoBody = false,
	warnedSetVelocityFailed = false,
	warnedUpdateError = false,
}

local function firstAvailableFunction(tableValue, names)
	if not tableValue then
		return nil
	end
	for _, name in ipairs(names) do
		local fn = tableValue[name]
		if type(fn) == "function" then
			return fn
		end
	end
	return nil
end

local function safeCall(label, fn)
	local ok, result = pcall(fn)
	if not ok then
		engine_log("[fp-controller] ERROR in " .. label .. ": " .. tostring(result))
		return false, nil
	end
	return true, result
end

local function physicsAvailable()
	return config.usePhysics
		and Physics
		and Physics.isAvailable
		and Physics.isAvailable()
end

local function refreshPhysicsRuntimeState()
	state.physicsRuntimeEnabled = false

	if not config.usePhysics then
		if not state.warnedNoPhysicsApi then
			engine_log("[fp-controller] usePhysics=false; using transform-only movement (no collision)")
			state.warnedNoPhysicsApi = true
		end
		return false
	end

	-- Check if the Physics global table and isAvailable function exist
	if not Physics then
		if not state.warnedNoPhysicsApi then
			engine_log("[fp-controller] WARNING: Physics global not found; falling back to transform movement")
			state.warnedNoPhysicsApi = true
		end
		return false
	end

	if not Physics.isAvailable or not Physics.isAvailable() then
		if not state.warnedNoPhysicsApi then
			engine_log("[fp-controller] WARNING: Physics.isAvailable() returned false; physics bindings not wired")
			state.warnedNoPhysicsApi = true
		end
		return false
	end

	-- Physics API exists; now check if THIS entity has a rigid body
	if not Physics.hasBody then
		if not state.warnedNoBody then
			engine_log("[fp-controller] WARNING: Physics.hasBody not available")
			state.warnedNoBody = true
		end
		return false
	end

	local hasBody = Physics.hasBody()
	if not hasBody then
		if not state.warnedNoBody then
			engine_log("[fp-controller] WARNING: No rigid body on this entity (Physics.hasBody()=false)")
			engine_log("[fp-controller]   -> Add a RigidBodyComponent + ColliderComponent for physics-based movement")
			engine_log("[fp-controller]   -> Falling back to transform movement (no collision response)")
			state.warnedNoBody = true
		end
		return false
	end

	-- All checks passed
	state.physicsRuntimeEnabled = true
	return true
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
	if Input.isKeyPressed("W") then z = z + 1.0 end
	if Input.isKeyPressed("S") then z = z - 1.0 end

	x, z = normalize2(x, z)

	local isSprinting = Input.isKeyPressed("LEFT_SHIFT") or Input.isKeyPressed("RIGHT_SHIFT")
	local speed = config.moveSpeed * (isSprinting and config.sprintMultiplier or 1.0)
	return x, z, speed
end

local function applyMouseLook()
	if config.requireRightMouse and not Input.isMouseButtonPressed("RIGHT") then
		return
	end

	-- Use getMouseDelta for infinite mouse look (works with captured cursor)
	local delta = Input.getMouseDelta and Input.getMouseDelta()
	if not delta then
		-- Fallback to absolute position deltas for older engine builds
		local mouse = Input.getMousePosition()
		if not mouse then return end
		if state.lastMouseX == nil then
			state.lastMouseX = mouse.x
			state.lastMouseY = mouse.y
			return
		end
		delta = { x = mouse.x - state.lastMouseX, y = mouse.y - state.lastMouseY }
		state.lastMouseX = mouse.x
		state.lastMouseY = mouse.y
	end

	state.yaw = state.yaw + delta.x * config.lookSensitivity
	state.pitch = state.pitch - delta.y * config.lookSensitivity

	if state.pitch > config.maxPitch then state.pitch = config.maxPitch end
	if state.pitch < -config.maxPitch then state.pitch = -config.maxPitch end

	-- For FPS, keep body yaw-only; pitch is applied to camera.
	Transform.setRotation(0.0, state.yaw, 0.0)
	if state.physicsRuntimeEnabled and Physics.setRotation then
		Physics.setRotation(0.0, state.yaw, 0.0, true)
	end
end

local function computeHorizontalVelocity()
	local x, z, speed = getMoveInput()
	if x == 0.0 and z == 0.0 then
		return 0.0, 0.0
	end

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
	local velX, velZ = computeHorizontalVelocity()

	-- Try physics-based movement first
	if state.physicsRuntimeEnabled and Physics.getLinearVelocity and Physics.setLinearVelocity then
		local vel = Physics.getLinearVelocity()
		if vel then
			local newY = vel.y
			if state.grounded and newY < config.groundStickVelocity then
				newY = config.groundStickVelocity
			end
			local ok = Physics.setLinearVelocity(velX, newY, velZ, true)
			if ok then
				return
			end
			if not state.warnedSetVelocityFailed then
				engine_log("[fp-controller] setLinearVelocity failed; verify rigid body is dynamic")
				state.warnedSetVelocityFailed = true
			end
		end
	end

	-- Transform fallback
	if not config.allowTransformFallback then
		return
	end

	if velX == 0.0 and velZ == 0.0 then
		return
	end

	Transform.translate(velX * deltaTime, 0.0, velZ * deltaTime)
end

local function updateGroundedPhysics()
	state.grounded = false
	if not state.physicsRuntimeEnabled or not Physics.raycast then
		return false
	end

	local pos = Transform.getPosition()
	if not pos then
		return false
	end

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

	if not state.physicsRuntimeEnabled or not Physics.getLinearVelocity or not Physics.setLinearVelocity then
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

		pos = Transform.getPosition()
		pos = resolveGround(pos)
		if pos then
			Transform.setPosition(pos.x, pos.y, pos.z)
		end
	else
		if pos.y ~= config.groundY then
			Transform.setPosition(pos.x, config.groundY, pos.z)
		end
	end
end

local function pickCameraEntity()
	state.cameraEntity = nil
	if not Scene then
		return
	end

	local findCamerasFn = firstAvailableFunction(Scene, { "FindCameras", "findCameras" })
	if not findCamerasFn then
		return
	end

	local okCams, cameras = safeCall("Scene.FindCameras", function()
		return findCamerasFn()
	end)
	if not okCams then
		return
	end

	if not cameras or #cameras == 0 then
		return
	end

	local getNameMethods = { "GetName", "getName" }
	if config.cameraName ~= "" then
		for _, camEntity in ipairs(cameras) do
			if camEntity then
				local getNameMethod = nil
				for _, methodName in ipairs(getNameMethods) do
					if type(camEntity[methodName]) == "function" then
						getNameMethod = methodName
						break
					end
				end

				local name = nil
				if getNameMethod then
					local okName, resolvedName = safeCall("CameraEntity." .. getNameMethod, function()
						return camEntity[getNameMethod](camEntity)
					end)
					if okName then
						name = resolvedName
					end
				end

				if name == config.cameraName then
					state.cameraEntity = camEntity
					break
				end
			end
		end
	end

	if not state.cameraEntity then
		state.cameraEntity = cameras[1]
	end

	local setActiveCameraFn = firstAvailableFunction(Scene, { "SetActiveCamera", "setActiveCamera" })
	if state.cameraEntity and setActiveCameraFn then
		safeCall("Scene.SetActiveCamera", function()
			setActiveCameraFn(state.cameraEntity)
		end)
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

	local camX = pos.x
	local camY = pos.y + config.cameraOffsetY
	local camZ = pos.z + config.cameraOffsetZ
	Camera.setPosition(camX, camY, camZ)
	if Camera.setRotation then
		Camera.setRotation(state.pitch, state.yaw, 0.0)
	end
end

local function maintainUpright()
	if not config.lockUpright then
		return
	end

	if state.physicsRuntimeEnabled and Physics.setRotation then
		Physics.setRotation(0.0, state.yaw, 0.0, true)
		if Physics.setAngularVelocity then
			Physics.setAngularVelocity(0.0, 0.0, 0.0, true)
		end
	else
		Transform.setRotation(0.0, state.yaw, 0.0)
	end
end

function onAwake()
	local ok = safeCall("onAwake", function()
		refreshPhysicsRuntimeState()

		local rot = Transform.getRotation()
		if rot then
			state.pitch = rot.x or 0.0
			state.yaw = rot.y or 0.0
		end

		Transform.setRotation(0.0, state.yaw, 0.0)
		if state.physicsRuntimeEnabled and Physics.setRotation then
			Physics.setRotation(0.0, state.yaw, 0.0, true)
		end

		local pos = Transform.getPosition()
		if pos then
			resolveGround(pos)
			if state.grounded then
				Transform.setPosition(pos.x, config.groundY, pos.z)
			end
		end

		if Entity and Entity.getName and Entity.setName then
			local name = Entity.getName() or "Player"
			Entity.setName(name .. " [FP Blueprint]")
		end

		if state.physicsRuntimeEnabled then
			engine_log("[fp-controller] Ready (PHYSICS mode) - WASD move, Space jump, mouse look")
		else
			engine_log("[fp-controller] Ready (TRANSFORM mode) - WASD move, Space jump, mouse look")
			engine_log("[fp-controller]   Transform mode has no collision response; add RigidBody+Collider for physics")
		end

		-- Capture and hide cursor for infinite mouse look
		if Input.setCursorMode then
			Input.setCursorMode("disabled")
		end

		pickCameraEntity()
		if Camera and Camera.setActive then
			Camera.setActive(true)
			state.cameraActive = true
			updateCamera()
		end
	end)

	if not ok then
		state.cameraActive = false
	end
end

function onEnable()
	state.lastMouseX = nil
	state.lastMouseY = nil
	refreshPhysicsRuntimeState()
	if Input.setCursorMode then
		Input.setCursorMode("disabled")
	end
	pickCameraEntity()
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

	local ok = safeCall("onUpdate", function()
		if config.usePhysics and not state.physicsRuntimeEnabled then
			refreshPhysicsRuntimeState()
		end

		-- Escape quits the game
		if Input.isKeyPressed("ESCAPE") and Application and Application.quit then
			Application.quit()
			return
		end

		if state.physicsRuntimeEnabled then
			updateGroundedPhysics()
		end

		applyMouseLook()
		moveHorizontal(deltaTime)
		maintainUpright()

		if state.physicsRuntimeEnabled then
			updateJumpPhysics()
		else
			updateGravityAndJump(deltaTime)
		end
		updateCamera()
	end)

	if not ok and not state.warnedUpdateError then
		engine_log("[fp-controller] onUpdate failed once; see error above")
		state.warnedUpdateError = true
	end
end

function onDisable()
	state.lastMouseX = nil
	state.lastMouseY = nil
	if Input.setCursorMode then
		Input.setCursorMode("normal")
	end
	if state.cameraActive and Camera and Camera.setActive then
		Camera.setActive(false)
	end
	state.cameraActive = false
end

function onDestroy()
	state.lastMouseX = nil
	state.lastMouseY = nil
	if Input.setCursorMode then
		Input.setCursorMode("normal")
	end
	if state.cameraActive and Camera and Camera.setActive then
		Camera.setActive(false)
	end
	state.cameraActive = false
end

