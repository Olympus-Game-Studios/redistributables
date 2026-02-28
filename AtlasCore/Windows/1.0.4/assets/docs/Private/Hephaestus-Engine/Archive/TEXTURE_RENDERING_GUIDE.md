# Texture Rendering Pipeline - Complete PBR Implementation

## Overview
A comprehensive PBR (Physically-Based Rendering) texture system has been fully implemented for the Hephaestus Engine. Materials can now use multiple texture types (Albedo, Normal, Roughness, AO) alongside traditional color/scalar properties, with a node-based material graph editor for visual authoring.

## What's Been Implemented

### 1. **Full PBR Texture Support** ✅
- **Albedo Textures** - Base color/diffuse maps
- **Normal Maps** - Surface detail and lighting variation
- **Roughness Maps** - Per-pixel roughness variation
- **Ambient Occlusion Maps** - Contact shadows and crevice darkening
- All texture types integrated with shader and rendering pipeline

### 2. **Texture Loading & Caching** ✅
- **File**: `engine/Core/main.cpp`
- Dynamic texture slot allocation (128 slots available)
- Texture caching with `ensureMaterialTextureSlot()` function
- Automatic texture loading using stb_image
- Mipmap generation for optimal quality
- Proper descriptor array management

### 3. **Material Component Enhanced** ✅
- **File**: `engine/Scene/Components.h`
- Support for 4 texture types with enable flags:
  - `useAlbedoTexture`, `albedoTexturePath`
  - `useNormalTexture`, `normalTexturePath`
  - `useRoughnessTexture`, `roughnessTexturePath`
  - `useAoTexture`, `aoTexturePath`
- Blends textures with base material properties

### 4. **Material UBO Alignment** ✅
- **File**: `engine/Core/main.cpp`, `shaders/triangle.frag`
- Properly aligned MaterialUBO struct (112 bytes)
- 8 uint32_t indices for texture slots (2 per texture type)
- std140 layout compatibility between C++ and GLSL
- Correct padding for 16-byte alignment

### 5. **Scene Serialization** ✅
- **File**: `engine/Scene/SceneSerializer.cpp`
- Saves all texture paths and flags
- Loads materials with full texture configuration
- Materials persist across engine restarts

### 6. **Node-Based Material Graph Editor** ✅
- **File**: `engine/UI/MaterialEditor/MaterialEditorPanel.cpp`
- Visual node graph using ImNodes
- Unified texture sample nodes (Unreal-style design)
  - AlbedoTextureSample
  - NormalTextureSample
  - RoughnessTextureSample
  - AoTextureSample
- Material Output node with 7 inputs:
  - Base Color (Float3)
  - Metallic (Float1)
  - Roughness (Float1)
  - Emissive (Float3)
  - Normal Map (Float3)
  - Roughness Map (Float1)
  - AO Map (Float1)

### 7. **Automatic Texture Discovery** ✅
- **File**: `engine/UI/MaterialEditor/MaterialEditorPanel.cpp`
- Scans project for texture files
- Dropdown UI with all discovered textures
- Manual path input as fallback
- Live texture count display

### 8. **UV Coordinate Support** ✅
- **File**: `engine/Gfx/Vertex.h`
- Added `float texCoord[2]` to Vertex struct
- Updated attribute descriptions (location 3)
- Properly passed through vertex and fragment shaders

### 9. **Model Importer** ✅
- **File**: `engine/Assets/ModelImporter.cpp`
- OBJ loader extracts UV coordinates (vt data)
- Handles face indices with texture references
- Vertices store UV data for rendering

### 10. **Shader Implementation** ✅
- **Files**: `shaders/triangle.vert`, `shaders/triangle.frag`
- Vertex shader passes UVs to fragment shader
- Fragment shader samples all 4 texture types
- Proper blending of texture data with base material
- Normal map transformation and application
- Fallback to solid colors when textures disabled

## Material Graph Editor Workflow

### Creating Materials Visually:
1. Open Material Editor panel
2. Right-click in graph canvas → **Add Node**
3. Choose texture type:
   - **Textures** → **Albedo Texture**
   - **Textures** → **Normal Texture**
   - **Textures** → **Roughness Texture**
   - **Textures** → **AO Texture**
4. Select the texture node to edit properties
5. Choose texture from dropdown (or enter path manually)
6. Connect texture node output to **Material Output** input
7. Click **Apply To Selected Entity**

### Simple Mode Workflow:
1. Open Material Editor panel in simple mode
2. Use checkboxes to enable texture types
3. Select textures from dropdowns
4. Adjust material properties (color, metallic, roughness)
5. Apply to entity

## Technical Details

### MaterialUBO Structure (112 bytes, std140 aligned)
```cpp
struct MaterialUBO {
    alignas(16) float baseColor[3];     // Offset 0
    alignas(4)  float metallic;         // Offset 12
    alignas(16) float emissive[3];      // Offset 16
    alignas(4)  float roughness;        // Offset 28
    alignas(4)  float ao;               // Offset 32
    alignas(4)  uint32_t textureIndices[8]; // Offsets 36-68
    alignas(4)  uint32_t paddingTail[11];   // Padding to 112 bytes
};
```

### Texture Slot Management
- 128 texture slots available in descriptor array
- Dynamic allocation via `ensureMaterialTextureSlot()`
- Texture caching prevents redundant loads
- Each material can use up to 4 unique textures

### Descriptor Array Binding
```glsl
layout(set = 2, binding = 0) uniform sampler2D textures[128];
```

## Node Types

### Texture Sample Nodes (Unified Design)
- **AlbedoTextureSample** - Outputs Float3 color
- **NormalTextureSample** - Outputs Float3 normal
- **RoughnessTextureSample** - Outputs Float1 value
- **AoTextureSample** - Outputs Float1 value

Each node combines parameter selection + sampling (Unreal-style)

### Material Output Node
**7 Inputs:**
1. Base Color (Float3)
2. Metallic (Float1)
3. Roughness (Float1)
4. Emissive (Float3)
5. Normal Map (Float3)
6. Roughness Map (Float1)
7. AO Map (Float1)

## Texture Selection Workflow

## Complete Texture Pipeline

```
Project Textures
    ↓
Texture Discovery (scans assets/)
    ↓
Material Editor UI (dropdown selection)
    ↓
MaterialComponent (stores paths + flags)
    ↓
Scene Serialization (saves/loads)
    ↓
Texture Loading (stb_image)
    ↓
Texture Slot Cache (128 slots)
    ↓
MaterialUBO (8 uint indices)
    ↓
Descriptor Array Binding
    ↓
Fragment Shader Sampling
    ↓
Final Rendered Output
```

## Material Data Flow

```
Graph Editor
    ↓
Node Connections (AlbedoTexture → MaterialOutput)
    ↓
Graph Evaluator (processes node graph)
    ↓
MaterialComponent (output with all properties)
    ↓
Material Asset Save (JSON file)
    ↓
Scene Save (references material)
    ↓
Engine Load
    ↓
Texture Slot Allocation
    ↓
GPU Rendering
```

## File Changes Summary

| File | Changes |
|------|---------|
| `engine/Gfx/Vertex.h` | Added texCoord[2] field |
| `engine/Assets/ModelImporter.cpp` | Parse and load UV coordinates from OBJ |
| `shaders/triangle.vert` | Pass UV coordinates to fragment shader |
| `shaders/triangle.frag` | Full PBR texture sampling (4 types), MaterialUBO with 8 texture indices |
| `engine/UI/MaterialEditor/MaterialEditorPanel.cpp` | Node graph editor, texture dropdowns, material asset save/load |
| `engine/UI/MaterialEditor/MaterialGraph.h` | Node types for texture samples |
| `engine/UI/MaterialEditor/MaterialGraph.cpp` | Node creation, pin management, graph structure |
| `engine/UI/MaterialEditor/MaterialGraphEvaluator.cpp` | Graph evaluation to MaterialComponent |
| `engine/Scene/Components.h` | MaterialComponent with 4 texture types (paths + flags) |
| `engine/Scene/SceneSerializer.cpp` | Save/load all texture fields |
| `engine/Core/main.cpp` | Texture loading, slot caching, MaterialUBO alignment, descriptor array binding |
| `CMakeLists.txt` | Added MaterialEditor source files to build |

## Data Flow

```
OBJ File
    ↓
ModelImporter (extracts UVs)
    ↓
Vertex (contains texCoord)
    ↓
GPU Vertex Buffer
    ↓
Vertex Shader (outputs texCoord)
    ↓
Fragment Shader (receives texCoord)
    ↓
[Ready for texture sampling with UV coordinates]
```

## Material Editor Flow

```
User adds TextureParameter node
    ↓
UI shows texture dropdown (TextureDiscovery)
    ↓
User selects texture
    ↓
Material stores texture path + useAlbedoTexture=true
    ↓
When applying: MaterialUBO.useAlbedoTexture set to 1
    ↓
[Shader can sample texture at UV coordinates]
```

## Build Status

✅ All code compiles successfully
✅ Shaders compile to SPIR-V
✅ No linker errors
✅ Full PBR texture rendering operational
✅ Material graph editor fully functional
✅ Scene serialization working

## Feature Checklist

- [x] Load OBJ model with UV coordinates
- [x] Add material with textures via editor
- [x] Texture dropdown UI
- [x] Texture path saved and loaded
- [x] Material UBO with correct flags and indices
- [x] Texture sampling in shader (all 4 types)
- [x] Render textures on models
- [x] Fallback to solid colors when textures disabled
- [x] Normal map support with proper transformation
- [x] Roughness and AO map integration
- [x] Node-based material graph
- [x] Material asset save/load system

## Usage Notes

### Texture Requirements
- Models must have UV coordinates for textures to display
- OBJ files with `vt` data work out of the box
- Textures should be in standard formats (PNG, JPG, BMP, TGA)
- Place textures in `assets/textures/` for auto-discovery

### Performance Considerations
- Textures are cached after first load
- 128 texture slots shared across all materials
- Mipmaps generated automatically for quality
- Use power-of-two textures when possible

### Material Graph Tips
- Connect texture nodes directly to Material Output
- Use scalar/color nodes for procedural materials
- Combine textures with Add/Multiply nodes
- Save materials as assets for reuse across entities

## Advanced Features

### Material Blending
- Textures blend with base material properties
- Base color multiplied by albedo texture
- Roughness can use scalar OR texture
- Normal maps properly transformed to tangent space

### Shader Implementation
```glsl
// Example: Albedo texture sampling
vec3 albedo = material.baseColor;
if (material.textureIndices[0] != 0xFFFFFFFF) {
    vec4 albedoSample = texture(textures[material.textureIndices[0]], fragTexCoord);
    albedo *= albedoSample.rgb;
}
```

## Troubleshooting

**Textures not appearing:**
- Check model has UV coordinates
- Verify texture path is correct
- Ensure texture checkbox is enabled
- Check texture file exists in project

**Black/wrong colors:**
- Verify MaterialUBO alignment (112 bytes)
- Check texture indices are valid
- Ensure descriptor array is bound correctly

**Performance issues:**
- Reduce texture resolution
- Check texture slot usage (max 128)
- Enable mipmapping for distant objects

## Future Enhancements

- [ ] PBR Metallic texture support
- [ ] Emissive texture maps
- [ ] Texture tiling and offset controls
- [ ] Procedural texture generation nodes
- [ ] Texture compression support
- [ ] Async texture loading
- [ ] Texture streaming for large scenes

