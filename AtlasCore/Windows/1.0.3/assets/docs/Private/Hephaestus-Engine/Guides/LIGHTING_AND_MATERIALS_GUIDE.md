````markdown
# Advanced Material & Lighting Examples

## Preset Materials

### Common Material Presets

```cpp
// Gold metal
MaterialComponent gold;
gold.albedo = Vec3(1.0f, 0.766f, 0.336f);
gold.metallic = 1.0f;
gold.roughness = 0.2f;

// Silver metal
MaterialComponent silver;
silver.albedo = Vec3(0.972f, 0.960f, 0.915f);
silver.metallic = 1.0f;
silver.roughness = 0.15f;

// Copper metal
MaterialComponent copper;
copper.albedo = Vec3(0.955f, 0.638f, 0.538f);
copper.metallic = 1.0f;
copper.roughness = 0.25f;

// Iron metal
MaterialComponent iron;
iron.albedo = Vec3(0.560f, 0.570f, 0.580f);
iron.metallic = 1.0f;
iron.roughness = 0.4f;

// Polished plastic
MaterialComponent plastic;
plastic.albedo = Vec3(0.8f, 0.1f, 0.1f); // Red
plastic.metallic = 0.0f;
plastic.roughness = 0.3f;

// Rubber
MaterialComponent rubber;
rubber.albedo = Vec3(0.1f, 0.1f, 0.1f); // Black
rubber.metallic = 0.0f;
rubber.roughness = 0.8f;

// Glass (approximation without transparency)
MaterialComponent glass;
glass.albedo = Vec3(0.95f, 0.95f, 0.95f);
glass.metallic = 0.0f;
glass.roughness = 0.05f;

// Wood (rough dielectric)
MaterialComponent wood;
wood.albedo = Vec3(0.4f, 0.25f, 0.15f);
wood.metallic = 0.0f;
wood.roughness = 0.7f;

// Ceramic
MaterialComponent ceramic;
ceramic.albedo = Vec3(0.9f, 0.9f, 0.85f);
ceramic.metallic = 0.0f;
ceramic.roughness = 0.4f;

// Stone
MaterialComponent stone;
stone.albedo = Vec3(0.3f, 0.3f, 0.3f);
stone.metallic = 0.0f;
stone.roughness = 0.85f;
stone.ao = 0.7f; // Slight ambient occlusion

// Neon/Glowing material
MaterialComponent neon;
neon.albedo = Vec3(1.0f, 0.0f, 1.0f); // Magenta
neon.metallic = 0.0f;
neon.roughness = 0.2f;
neon.emissive = Vec3(1.0f, 0.0f, 1.0f);
neon.emissiveStrength = 5.0f;
```

## Lighting Scenarios

### 1. Outdoor Daytime Scene

```cpp
// Strong directional light (sun)
Entity sun = scene.CreateEntity("Sun");
sun.AddComponent<LightComponent>(LightComponent::CreateDirectional(
    Vec3(0.5f, -1.0f, 0.3f),     // Afternoon sun angle
    Vec3(1.0f, 0.95f, 0.85f),    // Warm white
    1.2f                          // Bright
));

// Blue ambient (sky light)
// In your frame update:
lightUBO.ambientColor = Vec3(0.4f, 0.5f, 0.7f);
lightUBO.ambientIntensity = 0.5f;
```

### 2. Indoor Office Scene

```cpp
// Ceiling lights (multiple point lights)
for (int i = 0; i < 4; ++i) {
    Entity light = scene.CreateEntity("Ceiling Light " + std::to_string(i));
    auto& transform = light.AddComponent<TransformComponent>();
    transform.position = Vec3((i % 2) * 4.0f - 2.0f, 3.0f, (i / 2) * 4.0f - 2.0f);
    light.AddComponent<LightComponent>(LightComponent::CreatePoint(
        Vec3(1.0f, 0.95f, 0.9f),  // Fluorescent white
        3.0f,                      // Medium intensity
        8.0f                       // Moderate range
    ));
}

// Weak warm ambient
lightUBO.ambientColor = Vec3(0.3f, 0.25f, 0.2f);
lightUBO.ambientIntensity = 0.2f;
```

### 3. Sunset Scene

```cpp
// Low angle warm sun
Entity sun = scene.CreateEntity("Setting Sun");
sun.AddComponent<LightComponent>(LightComponent::CreateDirectional(
    Vec3(0.8f, -0.3f, 0.5f),     // Low angle
    Vec3(1.0f, 0.6f, 0.3f),      // Orange-red
    0.6f                          // Dimmer than midday
));

// Purple-blue ambient (dusk sky)
lightUBO.ambientColor = Vec3(0.3f, 0.2f, 0.5f);
lightUBO.ambientIntensity = 0.4f;
```

### 4. Night Scene with Artificial Lights

```cpp
// No or very weak directional light (moon)
Entity moon = scene.CreateEntity("Moon");
moon.AddComponent<LightComponent>(LightComponent::CreateDirectional(
    Vec3(0.3f, -1.0f, 0.2f),
    Vec3(0.6f, 0.7f, 0.9f),      // Cool blue
    0.15f                         // Very dim
));

// Street lamps (warm point lights)
Entity streetLamp1 = scene.CreateEntity("Street Lamp 1");
auto& lamp1Pos = streetLamp1.AddComponent<TransformComponent>();
lamp1Pos.position = Vec3(-5.0f, 2.5f, 0.0f);
streetLamp1.AddComponent<LightComponent>(LightComponent::CreatePoint(
    Vec3(1.0f, 0.8f, 0.5f),      // Warm yellow
    8.0f,
    12.0f
));

// Dark blue ambient
lightUBO.ambientColor = Vec3(0.05f, 0.05f, 0.15f);
lightUBO.ambientIntensity = 0.15f;
```

### 5. Studio/Gallery Lighting

```cpp
// Overhead key light
Entity keyLight = scene.CreateEntity("Key Light");
auto& keyPos = keyLight.AddComponent<TransformComponent>();
keyPos.position = Vec3(2.0f, 5.0f, 2.0f);
keyLight.AddComponent<LightComponent>(LightComponent::CreatePoint(
    Vec3(1.0f, 1.0f, 1.0f),
    10.0f,
    15.0f
));

// Fill light (softer, opposite side)
Entity fillLight = scene.CreateEntity("Fill Light");
auto& fillPos = fillLight.AddComponent<TransformComponent>();
fillPos.position = Vec3(-3.0f, 3.0f, 1.0f);
fillLight.AddComponent<LightComponent>(LightComponent::CreatePoint(
    Vec3(0.9f, 0.9f, 1.0f),      // Slightly cool
    4.0f,                         // Dimmer than key
    12.0f
));

// Back/rim light
Entity rimLight = scene.CreateEntity("Rim Light");
auto& rimPos = rimLight.AddComponent<TransformComponent>();
rimPos.position = Vec3(0.0f, 4.0f, -4.0f);
rimLight.AddComponent<LightComponent>(LightComponent::CreatePoint(
    Vec3(1.0f, 1.0f, 1.0f),
    6.0f,
    10.0f
));

// Minimal ambient
lightUBO.ambientColor = Vec3(0.1f, 0.1f, 0.1f);
lightUBO.ambientIntensity = 0.1f;
```

### 6. Sci-Fi/Cyberpunk Scene

```cpp
// Dim directional (moonlight or artificial)
Entity ambient = scene.CreateEntity("Ambient");
ambient.AddComponent<LightComponent>(LightComponent::CreateDirectional(
    Vec3(0.0f, -1.0f, 0.0f),
    Vec3(0.3f, 0.4f, 0.6f),
    0.2f
));

// Neon lights (multiple colored point lights)
Entity neonRed = scene.CreateEntity("Neon Red");
auto& neonRedPos = neonRed.AddComponent<TransformComponent>();
neonRedPos.position = Vec3(-3.0f, 1.5f, 2.0f);
neonRed.AddComponent<LightComponent>(LightComponent::CreatePoint(
    Vec3(1.0f, 0.0f, 0.3f),      // Hot pink
    12.0f,
    8.0f
));

Entity neonCyan = scene.CreateEntity("Neon Cyan");
auto& neonCyanPos = neonCyan.AddComponent<TransformComponent>();
neonCyanPos.position = Vec3(3.0f, 1.5f, 2.0f);
neonCyan.AddComponent<LightComponent>(LightComponent::CreatePoint(
    Vec3(0.0f, 1.0f, 1.0f),      // Cyan
    12.0f,
    8.0f
));

// Dark purple ambient
lightUBO.ambientColor = Vec3(0.1f, 0.0f, 0.2f);
lightUBO.ambientIntensity = 0.25f;
```

## Material Animation Examples

### Pulsing Emissive Material

```cpp
// In your main loop, before rendering:
float time = glfwGetTime();
float pulse = (std::sin(time * 2.0f) + 1.0f) * 0.5f; // 0 to 1

if (entity.HasComponent<MaterialComponent>()) {
    auto& mat = entity.GetComponent<MaterialComponent>();
    mat.emissiveStrength = pulse * 5.0f; // Pulse between 0 and 5
}
```

### Color Shifting Material

```cpp
float time = glfwGetTime();
float hue = std::fmod(time * 0.2f, 1.0f); // Cycle through hues

// Simple hue to RGB conversion (for 0-1 hue range)
auto hueToRGB = [](float h) -> Vec3 {
    float r = std::abs(h * 6.0f - 3.0f) - 1.0f;
    float g = 2.0f - std::abs(h * 6.0f - 2.0f);
    float b = 2.0f - std::abs(h * 6.0f - 4.0f);
    return Vec3(
        std::max(0.0f, std::min(1.0f, r)),
        std::max(0.0f, std::min(1.0f, g)),
        std::max(0.0f, std::min(1.0f, b))
    );
};

if (entity.HasComponent<MaterialComponent>()) {
    auto& mat = entity.GetComponent<MaterialComponent>();
    mat.albedo = hueToRGB(hue);
}
```

### Roughness Animation

```cpp
float time = glfwGetTime();
float roughness = (std::sin(time) + 1.0f) * 0.5f; // 0 to 1

if (entity.HasComponent<MaterialComponent>()) {
    auto& mat = entity.GetComponent<MaterialComponent>();
    mat.roughness = roughness;
}
```

## Light Animation Examples

### Flickering Light (Candle Effect)

```cpp
float time = glfwGetTime();
float flicker = 0.7f + 0.3f * std::sin(time * 10.0f) * std::sin(time * 7.3f);

if (entity.HasComponent<LightComponent>()) {
    auto& light = entity.GetComponent<LightComponent>();
    light.intensity = baseIntensity * flicker;
}
```

### Orbiting Light

```cpp
float time = glfwGetTime();
float radius = 5.0f;
float speed = 1.0f;

if (entity.HasComponent<TransformComponent>()) {
    auto& transform = entity.GetComponent<TransformComponent>();
    transform.position.x = std::cos(time * speed) * radius;
    transform.position.z = std::sin(time * speed) * radius;
    transform.position.y = 2.0f;
}
```

### Color Cycling Light

```cpp
float time = glfwGetTime();
Vec3 color1 = Vec3(1.0f, 0.0f, 0.0f); // Red
Vec3 color2 = Vec3(0.0f, 0.0f, 1.0f); // Blue
float t = (std::sin(time) + 1.0f) * 0.5f; // 0 to 1

if (entity.HasComponent<LightComponent>()) {
    auto& light = entity.GetComponent<LightComponent>();
    light.color.x = color1.x * (1.0f - t) + color2.x * t;
    light.color.y = color1.y * (1.0f - t) + color2.y * t;
    light.color.z = color1.z * (1.0f - t) + color2.z * t;
}
```

### Pulsing Point Light (Beacon)

```cpp
float time = glfwGetTime();
float pulse = std::max(0.0f, std::sin(time * 3.0f));
pulse = pulse * pulse; // Square for sharper pulse

if (entity.HasComponent<LightComponent>()) {
    auto& light = entity.GetComponent<LightComponent>();
    light.intensity = pulse * 15.0f; // Strong pulse
}
```

## Helper Functions

### Material Factory

```cpp
class MaterialFactory {
public:
    static MaterialComponent CreateMetal(const Vec3& color, float roughness = 0.2f) {
        MaterialComponent mat;
        mat.albedo = color;
        mat.metallic = 1.0f;
        mat.roughness = roughness;
        return mat;
    }
    
    static MaterialComponent CreatePlastic(const Vec3& color, float roughness = 0.4f) {
        MaterialComponent mat;
        mat.albedo = color;
        mat.metallic = 0.0f;
        mat.roughness = roughness;
        return mat;
    }
    
    static MaterialComponent CreateEmissive(const Vec3& color, float strength = 2.0f) {
        MaterialComponent mat;
        mat.albedo = color;
        mat.metallic = 0.0f;
        mat.roughness = 0.3f;
        mat.emissive = color;
        mat.emissiveStrength = strength;
        return mat;
    }
};

// Usage:
Entity goldCube = scene.CreateEntity("Gold");
goldCube.AddComponent<MaterialComponent>(
    MaterialFactory::CreateMetal(Vec3(1.0f, 0.766f, 0.336f), 0.2f)
);
```

### Light Factory

```cpp
class LightFactory {
public:
    static LightComponent CreateWarmLight(float intensity = 5.0f) {
        return LightComponent::CreatePoint(
            Vec3(1.0f, 0.8f, 0.6f), intensity, 10.0f
        );
    }
    
    static LightComponent CreateCoolLight(float intensity = 5.0f) {
        return LightComponent::CreatePoint(
            Vec3(0.6f, 0.8f, 1.0f), intensity, 10.0f
        );
    }
    
    static LightComponent CreateSunlight(const Vec3& direction) {
        return LightComponent::CreateDirectional(
            direction, Vec3(1.0f, 0.95f, 0.85f), 1.0f
        );
    }
};
```

## Tips for Best Results

1. **Use physically plausible values**
   - Keep albedo colors realistic (most surfaces are 0.02-0.8)
   - Metals should have colored albedo
   - Non-metals should have gray/white reflections

2. **Balance your lighting**
   - Use one strong key light
   - Add fill lights at lower intensity
   - Don't forget ambient for soft shadows

3. **Roughness matters**
   - Very smooth (0.0-0.2): Mirrors, polished metal, water
   - Medium (0.3-0.6): Plastic, painted surfaces, ceramic
   - Rough (0.7-1.0): Concrete, cloth, rough stone

4. **Energy conservation**
   - Rough + bright = unrealistic
   - The rougher a surface, the more light scatters

5. **Light intensity**
   - Directional: 0.5-2.0 typically
   - Point: 1.0-10.0 depending on range
   - Adjust range to limit light spread

6. **Color temperature**
   - Warm lights: More red/orange (sunset, fire, tungsten)
   - Cool lights: More blue (sky, fluorescent, moonlight)
   - Mix warm and cool for visual interest

```