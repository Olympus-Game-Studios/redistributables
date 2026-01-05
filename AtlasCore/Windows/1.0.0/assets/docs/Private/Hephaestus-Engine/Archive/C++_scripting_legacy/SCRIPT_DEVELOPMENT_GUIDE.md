# Hephaestus Engine - User Script Development Guide

## ⭐ Important: No Engine Source Changes Needed!

**You do NOT need to modify engine source code to create scripts.** All user scripts live in the `/scripts` directory completely separate from the engine.

## 📁 Script Directory Structure

```
/scripts/                          # USER SCRIPTS (modify freely!)
├── PlayerController.h             # Example player controller
├── MyGameScript.h                 # Your custom script
├── NPCBehavior.h                  # Another example
└── ...                            # Add more as needed

/engine/                           # ENGINE CORE (read-only)
├── Scripting/
│   ├── ScriptBase.h              # Base class (don't modify)
│   └── ScriptRegistry.h          # Registry (don't modify)
└── ...
```

## 🎯 Creating Your First Script

### Step 1: Create a Script File

Create a new file in `/scripts/` directory (e.g., `/scripts/MyScript.h`):

```cpp
#pragma once
#include "engine/Scripting/ScriptBase.h"
#include "engine/Scene/Components.h"
#include <iostream>

class MyScript : public ScriptBase {
public:
    MyScript(Entity entity, Scene* scene) {
        m_Entity = entity;
        m_Scene = scene;
    }

    void OnAwake() override {
        std::cout << "MyScript initialized!\n";
    }

    void OnUpdate(float deltaTime) override {
        // Your game logic here - called every frame
    }

    void OnDestroy() override {
        std::cout << "MyScript cleaned up\n";
    }

private:
    // Your member variables here
    float m_Speed = 5.0f;
};
```

### Step 2: Attach Script to Entity in Editor

1. Open the editor
2. Create or select an entity in the World Outliner
3. In the Details Panel, find the "Script Component" section
4. Enter your script name: `MyScript`
5. Done! The script will automatically load

### Step 3: Enter Play Mode and Test

1. Click the **Play** button
2. Your script's `OnUpdate()` will be called every frame
3. Use the Log Console to debug with `std::cout`

---

## 📚 Script Lifecycle

Every script goes through these phases:

```
Creation → OnAwake() → OnEnable() → OnUpdate() [every frame]
         → OnLateUpdate() [after all updates]
         → OnDisable() → OnDestroy()
```

### `OnAwake()`
Called once when the script first initializes. Use for setup.

```cpp
void OnAwake() override {
    std::cout << "Script starting up\n";
    m_StartPosition = m_Entity.GetComponent<TransformComponent>().position;
}
```

### `OnUpdate(float deltaTime)`
Called every frame. This is your main game loop.

```cpp
void OnUpdate(float deltaTime) override {
    auto& transform = m_Entity.GetComponent<TransformComponent>();
    transform.position.x += m_Speed * deltaTime;
}
```

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

## (archived full content)
