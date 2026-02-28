````markdown
# Scene Graph / Entity-Component System (ECS)

## Overview

The Hephaestus Engine now features a modern **Entity-Component-System (ECS)** architecture powered by [EnTT](https://github.com/skypjack/entt), providing:

- **High Performance**: Data-oriented design with cache-friendly memory layout
- **Flexibility**: Compose entity behavior from reusable components
- **Scene Graph**: Hierarchical parent-child relationships for complex scenes
- **Type Safety**: Compile-time type checking for components

---

## Architecture

### Core Classes

#### 1. **Entity** (`engine/Scene/Entity.h`)

A lightweight handle wrapping an `entt::entity` identifier. Provides convenient component access:

```cpp
Entity entity = scene.CreateEntity("MyEntity");

// Add components
entity.AddComponent<TransformComponent>(Vec3(0, 0, 0));
entity.AddComponent<MeshRendererComponent>();

// Get components
auto& transform = entity.GetComponent<TransformComponent>();
transform.position.x = 5.0f;

// Check for components
if (entity.HasComponent<SelectionComponent>()) {
    // Do something
}

// Remove components
entity.RemoveComponent<SelectionComponent>();
```

#### 2. **Scene** (`engine/Scene/Scene.h`)

Manages a collection of entities and their components. Provides:

- Entity lifecycle management (create/destroy)
- Parent-child hierarchy
- Entity queries
- Selection management

```cpp
Scene scene("Main Scene");

// Create entities
Entity entity1 = scene.CreateEntity("Cube");
Entity entity2 = scene.CreateEntity("Sphere");

// Hierarchy
scene.SetParent(entity2, entity1); // entity2 is child of entity1

// Query entities
auto view = scene.GetEntitiesWith<TransformComponent, MeshRendererComponent>();
for (auto entityHandle : view) {
    Entity entity(entityHandle, &scene);
    // Process entities with both components
}

// Selection
scene.SetSelectedEntity(entity1);
Entity selected = scene.GetSelectedEntity();
```

#### 3. **Components** (`engine/Scene/Components.h`)

Pure data structures attached to entities. No behavior/logic.

---

## Built-in Components

### **TagComponent**
```cpp
struct TagComponent {
    std::string tag;
};
```
Every entity has a name/tag for identification.

---

### **TransformComponent**
```cpp
struct TransformComponent {
    Vec3 position;
    Vec3 rotation;  // Euler angles (radians)
    Vec3 scale;
    
    // Hierarchy
    entt::entity parent;
    std::vector<entt::entity> children;
    
    Mat4 GetLocalMatrix() const;
    void SetFromMatrix(const Mat4& mat);
    Vec3 GetRotationDegrees() const;
    void SetRotationDegrees(const Vec3& degrees);
};
```
Defines position, rotation, and scale in 3D space. Supports parent-child relationships.

**Example:**
```cpp
auto& transform = entity.GetComponent<TransformComponent>();
transform.position = Vec3(10.0f, 5.0f, 0.0f);
transform.SetRotationDegrees(Vec3(0.0f, 45.0f, 0.0f)); // 45° Y rotation
transform.scale = Vec3(2.0f, 2.0f, 2.0f);
```

---

### **MeshRendererComponent**
```cpp
struct MeshRendererComponent {
    AABB localBounds;
    bool visible;
    
    AABB GetWorldBounds(const TransformComponent& transform) const;
};
```
Marks entities that should be rendered. Contains bounding box for culling/picking.

---

### **SelectionComponent**
```cpp
struct SelectionComponent {
    bool selected;
};
```
Tracks editor selection state.

---

### **CameraComponent**
```cpp
struct CameraComponent {
    float fov;
    float nearPlane;
    float farPlane;
    bool isPrimary;
};
```
Defines a camera viewpoint (not yet fully integrated).

---

## Usage Examples

### Creating a Scene with Entities

```cpp
// Create scene
Scene scene("Level 1");

// Create player entity
Entity player = scene.CreateEntity("Player");
player.AddComponent<TransformComponent>(Vec3(0, 0, 0));
player.AddComponent<MeshRendererComponent>();

// Create enemy entities
for (int i = 0; i < 5; i++) {
    Entity enemy = scene.CreateEntity("Enemy_" + std::to_string(i));
    auto& transform = enemy.AddComponent<TransformComponent>();
    transform.position = Vec3(i * 2.0f, 0, 0);
    enemy.AddComponent<MeshRendererComponent>();
}
```

---

### Hierarchical Transforms

```cpp
// Create parent
Entity spaceship = scene.CreateEntity("Spaceship");
spaceship.AddComponent<TransformComponent>();

// Create child (turret)
Entity turret = scene.CreateEntity("Turret");
auto& turretTransform = turret.AddComponent<TransformComponent>();
turretTransform.position = Vec3(0, 2, 0); // Local offset

// Establish hierarchy
scene.SetParent(turret, spaceship);

// Move parent - child moves with it
spaceship.GetComponent<TransformComponent>().position = Vec3(100, 0, 0);

// Get world transform (includes parent transforms)
Mat4 worldTransform = scene.GetWorldTransform(turret);
```

---

### System Patterns (Querying Entities)

```cpp
// Rendering System
void RenderSystem(Scene& scene, VkCommandBuffer cmd) {
    auto view = scene.GetEntitiesWith<TransformComponent, MeshRendererComponent>();
    
    for (auto entityHandle : view) {
        Entity entity(entityHandle, &scene);
        auto& transform = entity.GetComponent<TransformComponent>();
        auto& renderer = entity.GetComponent<MeshRendererComponent>();
        
        if (!renderer.visible)
            continue;
            
        Mat4 modelMatrix = transform.GetLocalMatrix();
        // Draw entity...
    }
}

// Physics System
void PhysicsSystem(Scene& scene, float deltaTime) {
    auto view = scene.GetEntitiesWith<TransformComponent, RigidBodyComponent>();
    
    for (auto entityHandle : view) {
        Entity entity(entityHandle, &scene);
        auto& transform = entity.GetComponent<TransformComponent>();
        auto& rigidbody = entity.GetComponent<RigidBodyComponent>();
        
        // Apply physics
        transform.position = vadd(transform.position, 
                                  vscale(rigidbody.velocity, deltaTime));
    }
}
```

---

### Selection & Picking

```cpp
// Ray picking (see main.cpp for full implementation)
Entity FindClosestHitEntity(const Ray& ray, Scene& scene, float& outDistance) {
    Entity closestEntity;
    float closestDist = 1e30f;
    
    auto view = scene.GetEntitiesWith<TransformComponent, MeshRendererComponent>();
    for (auto entityHandle : view) {
        Entity entity(entityHandle, &scene);
        auto& transform = entity.GetComponent<TransformComponent>();
        auto& renderer = entity.GetComponent<MeshRendererComponent>();
        
        AABB worldBounds = renderer.GetWorldBounds(transform);
        
        float tMin, tMax;
        if (worldBounds.IntersectRay(ray, tMin, tMax)) {
            float hitDist = (tMin > 0) ? tMin : tMax;
            if (hitDist > 0 && hitDist < closestDist) {
                closestDist = hitDist;
                closestEntity = entity;
            }
        }
    }
    
    outDistance = closestDist;
    return closestEntity;
}

// Usage
Ray pickRay = ScreenToWorldRay(mouseX, mouseY, ...);
float distance;
Entity hitEntity = FindClosestHitEntity(pickRay, scene, distance);

if (hitEntity) {
    scene.SetSelectedEntity(hitEntity);
}
```

---

## Creating Custom Components

Components are simple data structures. To create your own:

1. **Define the component** in `engine/Scene/Components.h`:

```cpp
struct RigidBodyComponent {
    Vec3 velocity;
    Vec3 acceleration;
    float mass = 1.0f;
    bool useGravity = true;
    
    RigidBodyComponent() : velocity(0, 0, 0), acceleration(0, 0, 0) {}
};

struct HealthComponent {
    float currentHealth = 100.0f;
    float maxHealth = 100.0f;
    
    bool IsAlive() const { return currentHealth > 0.0f; }
    void TakeDamage(float damage) { 
        currentHealth = std::max(0.0f, currentHealth - damage); 
    }
};
```

2. **Use the component**:

```cpp
Entity player = scene.CreateEntity("Player");
player.AddComponent<RigidBodyComponent>();
player.AddComponent<HealthComponent>();

// Later...
auto& health = player.GetComponent<HealthComponent>();
health.TakeDamage(25.0f);

if (!health.IsAlive()) {
    scene.DestroyEntity(player);
}
```

---

## Performance Considerations

### ✅ **DO**

- **Group related components**: Entities with the same components are stored together
- **Use views for queries**: `scene.GetEntitiesWith<A, B>()` is optimized
- **Add components at creation time**: Reduces fragmentation
- **Use simple data types**: POD structs perform best

### ❌ **DON'T**

- **Store pointers in components**: Entities can be destroyed
- **Add/remove components frequently**: Can cause fragmentation
- **Use virtual functions in components**: Breaks data-oriented design
- **Store large data in components**: Use handles/IDs instead

---

## Advanced Features

### Entity Destruction with Hierarchy

When destroying an entity with children:

```cpp
// Option 1: Children are reparented to world root (current behavior)
scene.DestroyEntity(parent);

// Option 2: Recursively destroy children (modify Scene.cpp)
void Scene::DestroyEntity(Entity entity) {
    // ... remove from parent ...
    
    // Destroy children recursively
    for (auto childHandle : transform.children) {
        DestroyEntity({ childHandle, this });
    }
    
    m_Registry.destroy(entity.m_EntityHandle);
}
```

### Finding Entities

```cpp
// By name
Entity player = scene.FindEntityByName("Player");

// By component query
auto enemies = scene.GetEntitiesWith<EnemyComponent>();

// Custom search
Entity FindEntityWithTag(Scene& scene, const std::string& searchTag) {
    auto view = scene.GetEntitiesWith<TagComponent>();
    for (auto handle : view) {
        Entity e(handle, &scene);
        if (e.GetComponent<TagComponent>().tag == searchTag) {
            return e;
        }
    }
    return {};
}
```

---

## Integration with Existing Code

The ECS system coexists with the old `SceneObject` system (from `Transform.h`). To fully migrate:

1. Replace `std::vector<SceneObject>` with `Scene`
2. Use `Entity` instead of array indices
3. Query with `GetEntitiesWith<>` instead of loops
4. Store `Entity` handles, not raw pointers

**Before:**
```cpp
std::vector<SceneObject> objects;
objects.push_back(SceneObject("Cube"));
objects[0].transform.position = Vec3(1, 2, 3);
```

**After:**
```cpp
Scene scene;
Entity cube = scene.CreateEntity("Cube");
cube.GetComponent<TransformComponent>().position = Vec3(1, 2, 3);
```

---

## Future Enhancements

- **Component serialization** (save/load scenes)
- **Entity prefabs** (reusable entity templates)
- **Script components** (Lua/C# scripting)
- **Event system** (component added/removed notifications)
- **Archetypes** (optimize for common entity patterns)
- **Multi-threading** (parallel system execution)

---

## References

- [EnTT Documentation](https://github.com/skypjack/entt/wiki)
- [ECS Design Patterns](https://github.com/skypjack/entt/wiki/Crash-Course:-entity-component-system)
- [Data-Oriented Design](https://www.dataorienteddesign.com/dodbook/)

---

## Quick Reference Card

| Task | Code |
|------|------|
| Create entity | `Entity e = scene.CreateEntity("Name");` |
| Add component | `e.AddComponent<ComponentType>(args...);` |
| Get component | `auto& c = e.GetComponent<ComponentType>();` |
| Check component | `if (e.HasComponent<ComponentType>()) {...}` |
| Remove component | `e.RemoveComponent<ComponentType>();` |
| Destroy entity | `scene.DestroyEntity(e);` |
| Query entities | `auto view = scene.GetEntitiesWith<A, B>();` |
| Set parent | `scene.SetParent(child, parent);` |
| Get world transform | `Mat4 m = scene.GetWorldTransform(e);` |
| Select entity | `scene.SetSelectedEntity(e);` |
| Get selected | `Entity s = scene.GetSelectedEntity();` |

---

**Congratulations!** Your engine now has a powerful, modern ECS architecture. 🎉

````