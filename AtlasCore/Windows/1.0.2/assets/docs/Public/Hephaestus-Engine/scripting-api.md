# Scripting API (High-Level Overview)

This document describes the **high-level** scripting APIs exposed by Hephaestus Engine. It is not an exhaustive internal reference, but a practical guide for gameplay scripters.

> The exact names and signatures will depend on your specific build. Use this as a conceptual map and adjust to match the actual APIs in your project.

---

## 1. Global functions

Common global helpers (examples):

```lua
-- Logging
LogInfo("Hello from script")
LogWarning("Something might be wrong")
LogError("Something is wrong")

-- Entity search
local player = FindEntityByName("Player")
local enemies = FindEntitiesWithTag("Enemy")

-- Time
local dt = GetDeltaTime()
local time = GetTime()
```

Replace these with the actual functions provided in your build. Frequently, a global `Engine` or `Game` object is used instead.

---

## 2. Entity object

Most scripts operate on an **entity** object, often available as `this` or via an API like `GetEntity()`.

Typical methods:

```lua
-- Transform
local transform = this:GetTransform()

-- Components
local rigidbody = this:GetRigidbody()
local audio = this:GetAudioSource()
local camera = this:GetCamera()
```

Entities may provide:

- `GetName()` / `SetName(name)`
- `GetTag()` / `SetTag(tag)`
- `Destroy()` – Remove the entity from the scene

---

## 3. Transform

A typical `Transform` API:

```lua
local transform = this:GetTransform()

-- Position
local pos = transform:GetPosition()
pos.x = pos.x + 1.0
transform:SetPosition(pos)

-- Rotation
local rot = transform:GetRotation()          -- e.g., quaternion or Euler
transform:SetRotation(rot)

-- Scale
local scale = transform:GetScale()
scale.x = 2.0
transform:SetScale(scale)
```

Some builds expose convenience methods like `Translate`, `Rotate`, etc.

---

## 4. Physics / Rigidbody

If physics is exposed:

```lua
local rb = this:GetRigidbody()

rb:AddForce({ x = 0, y = 10, z = 0 })
rb:SetVelocity({ x = 1, y = 0, z = 0 })

-- Collision callbacks
function OnCollisionEnter(other)
    LogInfo("Collided with " .. other:GetName())
end
```

> The exact structure of vectors and callbacks depends on your build. Replace with your engine’s conventions.

---

## 5. Input

A common pattern for input:

```lua
if Input:IsKeyDown("W") then
    -- Move forward
end

if Input:IsMouseButtonPressed("Left") then
    -- Fire weapon
end
```

There may also be high-level actions (e.g., “Jump”, “Interact”) if your project uses an input mapping system.

---

## 6. Audio

If audio is scriptable:

```lua
local audio = this:GetAudioSource()
audio:Play()
audio:Stop()
audio:SetVolume(0.5)
```

Some builds use a global audio manager:

```lua
Audio:PlayEvent("Play_Footstep")
```

---

## 7. Scene and entity management

Common operations:

```lua
-- Spawn a prefab/entity
local newEnemy = SpawnPrefab("EnemyBasic", position)

-- Destroy an entity
enemy:Destroy()

-- Load a different scene
Scene:Load("Scenes/Level02.scene")
```

Again, method names (`SpawnPrefab`, `Scene:Load`) are examples; adapt to your engine’s actual API.

---

## 8. Events and messaging

Many engines expose a simple event or messaging system:

```lua
-- Subscribe to an event
SubscribeEvent("OnPlayerDied", OnPlayerDied)

function OnPlayerDied()
    -- Handle event
end

-- Fire an event
DispatchEvent("OnDoorOpened", { doorId = 3 })
```

Or entity-level messages:

```lua
this:SendMessage("TakeDamage", { amount = 10 })
```

Refer to existing scripts in your project to see the preferred pattern.

---

## 9. Example: Simple player movement (conceptual)

```lua
speed = 5.0

local transform

function OnInit()
    transform = this:GetTransform()
end

function OnUpdate(dt)
    local move = { x = 0, y = 0, z = 0 }

    if Input:IsKeyDown("W") then
        move.z = move.z - 1
    end
    if Input:IsKeyDown("S") then
        move.z = move.z + 1
    end
    if Input:IsKeyDown("A") then
        move.x = move.x - 1
    end
    if Input:IsKeyDown("D") then
        move.x = move.x + 1
    end

    -- Normalize if length > 0 (implementation depends on your math API)
    -- move = Normalize(move)

    move.x = move.x * speed * dt
    move.y = move.y * speed * dt
    move.z = move.z * speed * dt

    local pos = transform:GetPosition()
    pos.x = pos.x + move.x
    pos.y = pos.y + move.y
    pos.z = pos.z + move.z
    transform:SetPosition(pos)
end
```

Use this example as a conceptual template and match the API calls to your engine’s actual scripting API.

---

## 10. Where to find more details

- Check the `Scripts/` folder of your project for real examples.
- Refer to internal/private engine documentation for exhaustive API references and internal design.
- Ask the engine team to update this document when new public-facing features are added.