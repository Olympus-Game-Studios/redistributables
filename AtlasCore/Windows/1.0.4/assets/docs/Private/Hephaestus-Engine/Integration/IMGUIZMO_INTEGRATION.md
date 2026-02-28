````markdown
# ImGuizmo Integration Guide

## Overview
ImGuizmo has been successfully integrated into the Hephaestus Engine, providing interactive 3D manipulation gizmos for scene objects.

## What Was Implemented

### 1. Math Library (`engine/Core/Math.h`)
- Created a shared math library with `Vec3` and `Mat4` structures
- Includes common vector operations (add, subtract, scale, dot, cross, normalize)
- Matrix operations for transforms (translation, rotation, scale, multiply)
- Camera matrices (LookAt, Perspective)
- Compatible with GLSL and ImGuizmo (column-major layout)

### 2. Transform System (`engine/Scene/Transform.h`)
- **Transform Component**: Stores position, rotation (Euler angles), and scale
  - `GetMatrix()`: Converts transform to a 4x4 matrix (TRS order)
  - `SetMatrix()`: Extracts transform from a matrix (for gizmo updates)
  
- **SceneObject**: Represents objects in the scene
  - Name, Transform, and selection state
  - Multiple objects can exist in the scene

### 3. Scene Hierarchy Window
- Lists all scene objects
- Click to select objects
- Currently includes 3 demo cubes:
  - Cube 1: At origin
  - Cube 2: At position (2, 0, 0) with half scale
  - Cube 3: At position (-2, 0, 0) with 45-degree rotation

### 4. Properties Window
- Shows properties of the selected object
- **Gizmo Mode Selector**:
  - Translate (E key)
  - Rotate (R key)
  - Scale (T key)
  
- **Coordinate Space**:
  - Local: Gizmo aligned to object's rotation
  - World: Gizmo aligned to world axes
  
- **Manual Transform Editor**:
  - Position: DragFloat3 for X, Y, Z
  - Rotation: Displayed in degrees
  - Scale: DragFloat3 with range limits

### 5. Interactive Gizmo
- Rendered in the viewport using ImGuizmo
- Click and drag gizmo handles to manipulate objects
- Real-time visual feedback
- Works with perspective camera
- Respects camera view and projection

### 6. Rendering Updates
- Added push constants to pipeline for per-object model matrices
- Updated vertex shader to apply model transform
- Multiple cubes rendered with individual transforms
- Each object drawn with its own transformation

### 7. CMake Configuration
- Added ImGuizmo library target
- Links ImGuizmo with ImGui and the main application

## Keyboard Shortcuts
- **E**: Switch to Translate mode
- **R**: Switch to Rotate mode
- **T**: Switch to Scale mode
- **Right Mouse Button + Drag**: Look around (camera)
- **WASD**: Move camera (when RMB held)
- **Q/E**: Move camera up/down (when RMB held)
- **Mouse Wheel**: Adjust camera speed

## How to Use

1. **Select an Object**: Click on an object in the Scene Hierarchy window
2. **Choose Gizmo Mode**: Use the radio buttons or keyboard shortcuts (E/R/T)
3. **Manipulate**: Click and drag the colored gizmo handles in the viewport
   - **Translate**: Drag arrows to move along axes, or squares to move on planes
   - **Rotate**: Drag circles to rotate around axes
   - **Scale**: Drag boxes to scale along axes
4. **Fine-tune**: Use the Properties window for precise numeric values

## Technical Details

### Push Constants
- The pipeline now uses push constants to send the model matrix to the vertex shader
- Size: 64 bytes (16 floats for a 4x4 matrix)
- Stage: Vertex shader only
- Updated per draw call

### Shader Updates
```glsl
layout(push_constant) uniform PushConstants {
    mat4 model;
} pc;

void main() {
    vec4 worldPos = pc.model * vec4(inPosition, 1.0);
    gl_Position = ubo.proj * ubo.view * worldPos;
    fragColor = inColor;
}
```

### Transform Decomposition
When ImGuizmo modifies a matrix, the `SetMatrix()` function extracts:
- **Translation**: From the last column (m[12], m[13], m[14])
- **Scale**: Length of the first three column vectors
- **Rotation**: Extracted after normalizing by scale (simplified Euler extraction)

## Future Enhancements

Possible improvements:
1. Add more gizmo features (universal transform, snapping)
2. Implement undo/redo for transformations
3. Add grid snapping with configurable snap values
4. Multi-object selection and manipulation
5. Copy/paste transforms
6. Reset transform button
7. Save/load scene configurations
8. Gizmo size adjustment
9. Different colored cubes or meshes for better identification
10. Parent-child hierarchies with relative transforms

## Files Modified/Created
- ✅ `CMakeLists.txt` - Added ImGuizmo library
- ✅ `engine/Core/Math.h` - New shared math library
- ✅ `engine/Scene/Transform.h` - New transform/scene object system
- ✅ `engine/Core/main.cpp` - Integrated ImGuizmo, scene objects, UI
- ✅ `engine/Gfx/VulkanPipeline.cpp` - Added push constants
- ✅ `shaders/triangle.vert` - Added model matrix push constant

## Build Status
✅ Successfully built and running
✅ All shaders compiled
✅ ImGuizmo library linked

````