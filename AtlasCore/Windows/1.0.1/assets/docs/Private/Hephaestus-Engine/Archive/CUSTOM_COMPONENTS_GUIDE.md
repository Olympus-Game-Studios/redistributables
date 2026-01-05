````markdown
# Quick Start: Creating Custom Components

This guide shows you how to extend the ECS with your own components and systems.

---

## Example 1: Physics Component

### Step 1: Define the Component

Add to `engine/Scene/Components.h`:

```cpp
/**
 * RigidBody component - adds physics simulation
 */
struct RigidBodyComponent {
    Vec3 velocity;
    Vec3 acceleration;
    float mass = 1.0f;
    float drag = 0.98f;  // Air resistance (0-1)
    bool useGravity = true;

    RigidBodyComponent() 
        : velocity(0, 0, 0), acceleration(0, 0, 0) {}
        
    RigidBodyComponent(float mass, bool gravity = true)
        : velocity(0, 0, 0), acceleration(0, 0, 0), 
          mass(mass), useGravity(gravity) {}
};
```

### Step 2: Use the Component

Add to your `main.cpp` or game logic:

```cpp
// Create a falling cube
Entity fallingCube = scene.CreateEntity("Falling Cube");
fallingCube.AddComponent<TransformComponent>(Vec3(0, 10, 0)); // Start at height
fallingCube.AddComponent<MeshRendererComponent>();
fallingCube.AddComponent<RigidBodyComponent>(1.0f, true); // 1kg mass, use gravity

// In your update loop:
void UpdatePhysics(Scene& scene, float deltaTime) {
    const Vec3 GRAVITY(0, -9.81f, 0);
    
    auto view = scene.GetEntitiesWith<TransformComponent, RigidBodyComponent>();
    for (auto handle : view) {
        Entity entity(handle, &scene);
        auto& transform = entity.GetComponent<TransformComponent>();
        auto& rb = entity.GetComponent<RigidBodyComponent>();
        
        // Apply gravity
        if (rb.useGravity) {
            rb.acceleration = GRAVITY;
        }
        
        // Update velocity
        rb.velocity = vadd(rb.velocity, vscale(rb.acceleration, deltaTime));
        
        // Apply drag
        rb.velocity = vscale(rb.velocity, rb.drag);
        
        // Update position
        transform.position = vadd(transform.position, vscale(rb.velocity, deltaTime));
        
        // Ground collision (simple)
        if (transform.position.y < 0) {
            transform.position.y = 0;
            rb.velocity.y = -rb.velocity.y * 0.5f; // Bounce with 50% energy loss
        }
    }
}
```

Then in your main loop:
```cpp
while (!glfwWindowShouldClose(window)) {
    // ... timing code ...
    
    UpdatePhysics(scene, dt);
    
    // ... rendering code ...
}
```

---

## Example 2: Health Component (Game Logic)

### Step 1: Define the Component

```cpp
/**
 * Health component - for damageable entities
 */
struct HealthComponent {
    float currentHealth;
    float maxHealth;
    bool isInvulnerable = false;

    HealthComponent(float max = 100.0f) 
        : currentHealth(max), maxHealth(max) {}

    void TakeDamage(float damage) {
        if (!isInvulnerable && damage > 0) {
            currentHealth = std::max(0.0f, currentHealth - damage);
        }
    }

    void Heal(float amount) {
        if (amount > 0) {
            currentHealth = std::min(maxHealth, currentHealth + amount);
        }
    }

    bool IsAlive() const { 
        return currentHealth > 0.0f; 
    }
    
    float GetHealthPercent() const {
        return currentHealth / maxHealth;
    }
};
```

### Step 2: Use the Component

```cpp
// Create player
Entity player = scene.CreateEntity("Player");
player.AddComponent<TransformComponent>();
player.AddComponent<MeshRendererComponent>();
player.AddComponent<HealthComponent>(100.0f); // 100 HP

// Create enemies
for (int i = 0; i < 5; i++) {
    Entity enemy = scene.CreateEntity("Enemy_" + std::to_string(i));
    enemy.AddComponent<TransformComponent>(Vec3(i * 2.0f, 0, 0));
    enemy.AddComponent<MeshRendererComponent>();
    enemy.AddComponent<HealthComponent>(50.0f); // 50 HP
}

// Combat system
void ApplyDamage(Entity target, float damage) {
    if (target.HasComponent<HealthComponent>()) {
        auto& health = target.GetComponent<HealthComponent>();
        health.TakeDamage(damage);
        
        if (!health.IsAlive()) {
            std::cout << "Entity died!" << std::endl;
            // Play death animation, drop loot, etc.
        }
    }
}

// Usage
ApplyDamage(player, 25.0f); // Player takes 25 damage
```

---

## Example 3: AI Component (Behavior)

### Step 1: Define the Component

```cpp
/**
 * AI component - simple patrol behavior
 */
struct AIComponent {
    enum class State {
        Idle,
        Patrol,
        Chase,
        Attack
    };
    
    State currentState = State::Idle;
    std::vector<Vec3> patrolPoints;
    int currentPatrolIndex = 0;
    float moveSpeed = 2.0f;
    float detectionRadius = 10.0f;
    entt::entity target{ entt::null }; // What we're chasing

    AIComponent() = default;
    
    AIComponent(const std::vector<Vec3>& points, float speed = 2.0f)
        : patrolPoints(points), moveSpeed(speed) {
        if (!points.empty()) {
            currentState = State::Patrol;
        }
    }
};
```

### Step 2: Implement AI System

```cpp
void UpdateAI(Scene& scene, float deltaTime) {
    auto view = scene.GetEntitiesWith<TransformComponent, AIComponent>();
    
    for (auto handle : view) {
        Entity entity(handle, &scene);
        auto& transform = entity.GetComponent<TransformComponent>();
        auto& ai = entity.GetComponent<AIComponent>();
        
        switch (ai.currentState) {
            case AIComponent::State::Patrol:
                UpdatePatrol(entity, transform, ai, deltaTime);
                break;
                
            case AIComponent::State::Chase:
                UpdateChase(entity, transform, ai, scene, deltaTime);
                break;
                
            // ... other states ...
        }
    }
}

void UpdatePatrol(Entity entity, TransformComponent& transform, 
                  AIComponent& ai, float deltaTime) {
    if (ai.patrolPoints.empty()) return;
    
    Vec3 targetPos = ai.patrolPoints[ai.currentPatrolIndex];
    Vec3 direction = vsub(targetPos, transform.position);
    float distance = vlength(direction);
    
    if (distance < 0.5f) {
        // Reached waypoint, move to next
        ai.currentPatrolIndex = (ai.currentPatrolIndex + 1) % ai.patrolPoints.size();
    } else {
        // Move towards waypoint
        Vec3 velocity = vscale(vnorm(direction), ai.moveSpeed * deltaTime);
        transform.position = vadd(transform.position, velocity);
    }
}
```

### Step 3: Create Patrolling Enemies

```cpp
// Create enemy with patrol route
Entity guard = scene.CreateEntity("Guard");
guard.AddComponent<TransformComponent>(Vec3(0, 0, 0));
guard.AddComponent<MeshRendererComponent>();

// Set up patrol route
std::vector<Vec3> patrolRoute = {
    Vec3(0, 0, 0),
    Vec3(5, 0, 0),
    Vec3(5, 0, 5),
    Vec3(0, 0, 5)
};
guard.AddComponent<AIComponent>(patrolRoute, 3.0f); // 3 units/sec

// In main loop
UpdateAI(scene, dt);
```

---

## Example 4: Light Component (Graphics)

### Step 1: Define the Component

```cpp
/**
 * Light component - defines a light source
 */
struct LightComponent {
    enum class Type {
        Directional,
        Point,
        Spot
    };
    
    Type type = Type::Point;
    Vec3 color = Vec3(1, 1, 1);      // RGB
    float intensity = 1.0f;
    float range = 10.0f;             // For point/spot lights
    float spotAngle = 45.0f;         // For spot lights (degrees)
    bool castShadows = true;

    LightComponent() = default;
    
    LightComponent(Type t, const Vec3& col, float intens) 
        : type(t), color(col), intensity(intens) {}
    
    // Factory methods
    static LightComponent Directional(const Vec3& color, float intensity) {
        return LightComponent(Type::Directional, color, intensity);
    }
    
    static LightComponent Point(const Vec3& color, float intensity, float range) {
        LightComponent light(Type::Point, color, intensity);
        light.range = range;
        return light;
    }
};
```

### Step 2: Use the Component

```cpp
// Sun (directional light)
Entity sun = scene.CreateEntity("Sun");
auto& sunTransform = sun.AddComponent<TransformComponent>();
sunTransform.SetRotationDegrees(Vec3(-45, 30, 0)); // Angle of sunlight
sun.AddComponent<LightComponent>(
    LightComponent::Directional(Vec3(1.0f, 0.95f, 0.8f), 1.0f)
);

// Torch (point light)
Entity torch = scene.CreateEntity("Torch");
torch.AddComponent<TransformComponent>(Vec3(5, 2, 0));
torch.AddComponent<MeshRendererComponent>(); // The torch mesh
torch.AddComponent<LightComponent>(
    LightComponent::Point(Vec3(1.0f, 0.5f, 0.2f), 2.0f, 8.0f)
);

// Collect lights for rendering
void GatherLights(Scene& scene, std::vector<LightData>& outLights) {
    outLights.clear();
    
    auto view = scene.GetEntitiesWith<TransformComponent, LightComponent>();
    for (auto handle : view) {
        Entity entity(handle, &scene);
        auto& transform = entity.GetComponent<TransformComponent>();
        auto& light = entity.GetComponent<LightComponent>();
        
        LightData data;
        data.position = transform.position;
        data.color = light.color;
        data.intensity = light.intensity;
        data.type = static_cast<int>(light.type);
        // ... fill other fields ...
        
        outLights.push_back(data);
    }
}
```

---

## Example 5: Lifetime Component (Auto-Destroy)

### Step 1: Define the Component

```cpp
/**
 * Lifetime component - destroys entity after time expires
 * Useful for particles, projectiles, temporary effects
 */
struct LifetimeComponent {
    float remainingTime;
    
    LifetimeComponent(float seconds) : remainingTime(seconds) {}
    
    bool IsExpired() const { return remainingTime <= 0.0f; }
};
```

### Step 2: Implement Lifetime System

```cpp
void UpdateLifetimes(Scene& scene, float deltaTime) {
    std::vector<Entity> toDestroy;
    
    auto view = scene.GetEntitiesWith<LifetimeComponent>();
    for (auto handle : view) {
        Entity entity(handle, &scene);
        auto& lifetime = entity.GetComponent<LifetimeComponent>();
        
        lifetime.remainingTime -= deltaTime;
        
        if (lifetime.IsExpired()) {
            toDestroy.push_back(entity);
        }
    }
    
    // Destroy expired entities
    for (Entity& entity : toDestroy) {
        scene.DestroyEntity(entity);
    }
}
```

### Step 3: Create Temporary Entities

```cpp
// Create a projectile that disappears after 3 seconds
Entity CreateProjectile(Scene& scene, Vec3 position, Vec3 velocity) {
    Entity projectile = scene.CreateEntity("Projectile");
    
    auto& transform = projectile.AddComponent<TransformComponent>(position);
    projectile.AddComponent<MeshRendererComponent>();
    projectile.AddComponent<RigidBodyComponent>();
    projectile.GetComponent<RigidBodyComponent>().velocity = velocity;
    projectile.GetComponent<RigidBodyComponent>().useGravity = false;
    
    projectile.AddComponent<LifetimeComponent>(3.0f); // Dies after 3 seconds
    
    return projectile;
}

// Usage
CreateProjectile(scene, Vec3(0, 1, 0), Vec3(10, 0, 0)); // Shoots to the right
```

---

## Putting It All Together

Here's a complete example combining multiple components:

```cpp
void InitializeGameScene(Scene& scene) {
    // Player
    Entity player = scene.CreateEntity("Player");
    player.AddComponent<TransformComponent>(Vec3(0, 0, 0));
    player.AddComponent<MeshRendererComponent>();
    player.AddComponent<HealthComponent>(100.0f);
    player.AddComponent<RigidBodyComponent>(70.0f); // 70kg player
    
    // Flying enemy
    Entity flyingEnemy = scene.CreateEntity("Flying Enemy");
    flyingEnemy.AddComponent<TransformComponent>(Vec3(10, 5, 0));
    flyingEnemy.AddComponent<MeshRendererComponent>();
    flyingEnemy.AddComponent<HealthComponent>(30.0f);
    auto& rb = flyingEnemy.AddComponent<RigidBodyComponent>(5.0f);
    rb.useGravity = false; // Flying enemy
    std::vector<Vec3> patrol = {
        Vec3(10, 5, 0), Vec3(10, 5, 10), Vec3(-10, 5, 10), Vec3(-10, 5, 0)
    };
    flyingEnemy.AddComponent<AIComponent>(patrol, 4.0f);
    
    // Environment light
    Entity sun = scene.CreateEntity("Sun");
    sun.AddComponent<TransformComponent>();
    sun.GetComponent<TransformComponent>().SetRotationDegrees(Vec3(-45, 30, 0));
    sun.AddComponent<LightComponent>(
        LightComponent::Directional(Vec3(1, 1, 1), 1.0f)
    );
    
    // Torch (follows player)
    Entity torch = scene.CreateEntity("Player Torch");
    torch.AddComponent<TransformComponent>();
    torch.AddComponent<LightComponent>(
        LightComponent::Point(Vec3(1, 0.7f, 0.3f), 2.0f, 10.0f)
    );
    scene.SetParent(torch, player); // Torch follows player
    torch.GetComponent<TransformComponent>().position = Vec3(0, 1.5f, 0); // Above player head
}

void UpdateGame(Scene& scene, float deltaTime) {
    UpdatePhysics(scene, deltaTime);
    UpdateAI(scene, deltaTime);
    UpdateLifetimes(scene, deltaTime);
    // ... other systems ...
}
```

---

## Best Practices

1. **Keep components data-only** - No methods that modify other components
2. **Put logic in systems** - Functions that iterate over entities
3. **Use small, focused components** - Better than one huge component
4. **Compose behavior** - Combine simple components for complex behavior
5. **Query efficiently** - Use `GetEntitiesWith<A, B>` not multiple loops
6. **Avoid storing Entity handles in components** - Use `entt::entity` if needed

---

## Component Design Checklist

When creating a new component, ask:

- ✅ Is it pure data (no behavior)?
- ✅ Can it be POD (Plain Old Data)?
- ✅ Is it small (< 64 bytes ideally)?
- ✅ Does it have a clear single purpose?
- ✅ Can multiple entities share this component type?
- ❌ Does it store pointers to other components?
- ❌ Does it have virtual functions?
- ❌ Does it depend on specific entity IDs?

---

Happy coding! 🚀

````