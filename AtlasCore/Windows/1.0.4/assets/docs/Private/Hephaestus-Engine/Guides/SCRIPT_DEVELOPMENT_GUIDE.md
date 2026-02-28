> ARCHIVED: This file was moved to `Documentation/Archive/C++_scripting_legacy/SCRIPT_DEVELOPMENT_GUIDE.md`.

The C++ script development guide has been archived because C++ gameplay scripting is deprecated. For current scripting workflows and Lua documentation, see:

- `Documentation/Scripting/LUA_SCRIPTING_GUIDE.md`
- `Documentation/Scripting/LUA_INTEGRATION_SUMMARY.md`

If you need access to the archived C++ materials, they are available in the repository archive folder above.

### `OnLateUpdate(float deltaTime)`
Called after all `OnUpdate()` calls. Good for camera updates.

```cpp
void OnLateUpdate(float deltaTime) override {
    // Post-processing, camera adjustments, etc
}
```

### `OnDestroy()`
Called when the script is destroyed. Use for cleanup.

```cpp
void OnDestroy() override {
    std::cout << "Script shutting down\n";
}
```

### Collision Events

```cpp
void OnTriggerEnter(Entity other) override {
    std::cout << "Collision detected!\n";
}

void OnTriggerStay(Entity other) override {
    // Called every frame while touching
}

void OnTriggerExit(Entity other) override {
    // Called when collision ends
}
```

---

## 🎮 Working with Components

### Get Entity Transform

```cpp
void OnUpdate(float deltaTime) override {
    if (m_Entity.HasComponent<TransformComponent>()) {
        auto& transform = m_Entity.GetComponent<TransformComponent>();
        
        // Position
        transform.position.x += 1.0f * deltaTime;
        
        // Rotation (in radians)
        transform.rotation.y += 3.14159f * deltaTime;
        
        // Scale
        transform.scale = Vec3(1.0f, 1.0f, 1.0f);
    }
}
```

### Change Material/Color

```cpp
void OnUpdate(float deltaTime) override {
    if (m_Entity.HasComponent<MaterialComponent>()) {
        auto& material = m_Entity.GetComponent<MaterialComponent>();
        
        material.albedo = Vec3(1.0f, 0.0f, 0.0f); // Red
        material.metallic = 0.8f;
        material.roughness = 0.2f;
        material.emissive = Vec3(0.5f, 0.5f, 0.5f);
    }
}
```

### Add Components

```cpp
void OnAwake() override {
    if (!m_Entity.HasComponent<MaterialComponent>()) {
        m_Entity.AddComponent<MaterialComponent>(Vec3(0.8f, 0.2f, 0.2f));
    }
}
```

---

## ⌨️ Input Handling

### Keyboard Input

```cpp
#include <GLFW/glfw3.h>

void OnUpdate(float deltaTime) override {
    GLFWwindow* window = glfwGetCurrentContext();
    if (!window) return;

    if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS) {
        std::cout << "W key pressed\n";
    }

    if (glfwGetKey(window, GLFW_KEY_SPACE) == GLFW_PRESS) {
        std::cout << "Space pressed\n";
    }
}
```

### Mouse Input

```cpp
void OnUpdate(float deltaTime) override {
    GLFWwindow* window = glfwGetCurrentContext();
    if (!window) return;

    // Get mouse position
    double mouseX, mouseY;
    glfwGetCursorPos(window, &mouseX, &mouseY);
    
    // Check mouse buttons
    if (glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_LEFT) == GLFW_PRESS) {
        std::cout << "Left click at " << mouseX << ", " << mouseY << "\n";
    }
}
```

### Key Constants

```cpp
GLFW_KEY_W, GLFW_KEY_A, GLFW_KEY_S, GLFW_KEY_D
GLFW_KEY_SPACE, GLFW_KEY_ENTER, GLFW_KEY_ESCAPE
GLFW_KEY_LEFT_SHIFT, GLFW_KEY_LEFT_CONTROL
GLFW_KEY_UP, GLFW_KEY_DOWN, GLFW_KEY_LEFT, GLFW_KEY_RIGHT
```

---

## 📐 Math Utilities

```cpp
#include "engine/Core/Math.h"

// Vector operations
Vec3 pos1(1, 2, 3);
Vec3 pos2(4, 5, 6);

Vec3 result = vadd(pos1, pos2);        // (5, 7, 9)
Vec3 scaled = vscale(pos1, 2.0f);      // (2, 4, 6)
Vec3 diff = vsub(pos2, pos1);          // (3, 3, 3)

// Magnitude
float distance = vmagnitude(diff);     // 5.196...

// Normalize
Vec3 direction = vnormalize(diff);     // Unit vector

// Dot product (similarity)
float dot = vdot(direction, Vec3(1, 0, 0));

// Cross product (perpendicular)
Vec3 cross = vcross(Vec3(1, 0, 0), Vec3(0, 1, 0));
```

---

## 🎯 Complete Example: Rotating Cube

```cpp
#pragma once
#include "engine/Scripting/ScriptBase.h"
#include "engine/Scene/Components.h"
#include <iostream>

class RotatingCube : public ScriptBase {
public:
    RotatingCube(Entity entity, Scene* scene) {
        m_Entity = entity;
        m_Scene = scene;
    }

    void OnAwake() override {
        std::cout << "RotatingCube started - rotating at " << m_RotationSpeed << " rad/s\n";
    }

    void OnUpdate(float deltaTime) override {
        if (m_Entity.HasComponent<TransformComponent>()) {
            auto& transform = m_Entity.GetComponent<TransformComponent>();
            
            // Rotate around Y axis
            transform.rotation.y += m_RotationSpeed * deltaTime;
            
            // Wrap rotation
            if (transform.rotation.y > 6.28f) {
                transform.rotation.y -= 6.28f;
            }
        }
    }

    void OnDestroy() override {
        std::cout << "RotatingCube destroyed\n";
    }

private:
    float m_RotationSpeed = 2.0f; // Radians per second
};
```

Save as `/scripts/RotatingCube.h` and attach to any entity!

---

## 🎮 Complete Example: PlayerController

See `/scripts/PlayerController.h` for a full example with:
- WASD movement
- Mouse look
- Sprint with Shift
- Q/E for vertical movement

Just attach it to an entity and play!

---

## 🔍 Accessing the Scene

```cpp
void OnUpdate(float deltaTime) override {
    // Find another entity by name
    Entity targetEntity = m_Scene->FindEntityByName("Target");
    
    // Find entities with specific components
    auto view = m_Scene->GetEntitiesWith<TransformComponent, MaterialComponent>();
    
    // Get world transform (includes parent transforms)
    Mat4 worldTransform = m_Scene->GetWorldTransform(m_Entity);
    
    // Set up parent-child relationships
    m_Scene->SetParent(childEntity, parentEntity);
}
```

---

## 💡 Best Practices

### 1. Cache Components in OnAwake()

```cpp
TransformComponent* m_Transform = nullptr;

void OnAwake() override {
    if (m_Entity.HasComponent<TransformComponent>()) {
        m_Transform = &m_Entity.GetComponent<TransformComponent>();
    }
}

void OnUpdate(float deltaTime) override {
    if (m_Transform) {
        m_Transform->position.x += 1.0f;
    }
}
```

### 2. Check Components Before Use

```cpp
if (m_Entity.HasComponent<MaterialComponent>()) {
    auto& material = m_Entity.GetComponent<MaterialComponent>();
    // Safe to use material
}
```

### 3. Use deltaTime for Frame-Independent Motion

```cpp
// ✅ Good: Works at any frame rate
position += velocity * deltaTime;

// ❌ Bad: Depends on frame rate
position += velocity;
```

### 4. Use Meaningful Member Variable Names

```cpp
// ✅ Good
float m_MovementSpeed = 10.0f;
Vec3 m_StartPosition;

// ❌ Bad
float speed = 10.0f;
Vec3 start;
```

### 5. Keep Heavy Operations Out of OnUpdate()

```cpp
// ❌ Bad - slow
void OnUpdate(float deltaTime) override {
    Entity foundEntity = m_Scene->FindEntityByName("Target");
}

// ✅ Good - cache in OnAwake
void OnAwake() override {
    m_TargetEntity = m_Scene->FindEntityByName("Target");
}
```

---

## 🐛 Debugging

### Print to Console

```cpp
#include <iostream>

void OnAwake() override {
    std::cout << "Position: " << m_Entity.GetComponent<TransformComponent>().position.x << std::endl;
}
```

### Print Vec3

```cpp
Vec3 pos = m_Entity.GetComponent<TransformComponent>().position;
std::cout << "Pos(" << pos.x << ", " << pos.y << ", " << pos.z << ")" << std::endl;
```

### Check Play Mode

Scripts only update when:
1. You click the **Play** button
2. You're not in **Paused** mode
3. The entity is enabled

---

## 🚀 Next Steps

1. **Start Simple** - Create a script that rotates an entity
2. **Add Movement** - Implement WASD movement like PlayerController
3. **Add Interactivity** - Handle mouse clicks and keyboard input
4. **Combine Multiple Scripts** - Attach multiple scripts to one entity
5. **Organize Scripts** - Create subdirectories in `/scripts/` for organization

---

## ❓ FAQ

**Q: Do I need to register scripts anywhere?**
A: No! Just create the file in `/scripts/` and attach it via the editor.

**Q: Can I modify engine files?**
A: Not recommended. Keep all gameplay code in `/scripts/`.

**Q: How do I reload scripts after editing?**
A: Rebuild the engine with `cmake --build build --config Release`

**Q: Can multiple scripts run on one entity?**
A: Yes! Attach as many as you want.

**Q: How do I pass data between scripts?**
A: Access other entities via `m_Scene->FindEntityByName()` or use components to store shared data.

**Q: What if my script isn't working?**
A: Check the console output. Add `std::cout` statements to debug.
