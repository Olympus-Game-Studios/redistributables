# HDRI Background Support

## Overview
The Hephaestus Engine now supports HDRI (High Dynamic Range Imaging) backgrounds and EXR images for scene environments. You can switch between a solid color background and an HDRI environment map.

## Features
- **Solid Color Background**: Traditional solid color background (default blue)
- **HDRI/EXR Background**: Load and display equirectangular HDRI images as skybox
- **Dynamic Switching**: Switch between modes at runtime via the Editor Settings
- **HDR Support**: Full floating-point HDR image loading with tone mapping

## How to Use

### Changing Background Type
1. Click **File** in the toolbar
2. Select **Settings** to open the Editor Settings dialog
3. Scroll to **Environment Settings** section
4. Choose between:
   - **Solid Color**: Use a simple solid color background
   - **HDRI**: Use an HDRI environment map

### Setting Solid Color Background
1. Select "Solid Color" as Background Type
2. Use the color picker to choose your background color
3. The background will update immediately

### Loading HDRI Background
1. Select "HDRI" as Background Type
2. Enter the path to your .hdr or .exr file in the "HDRI Path" field
   - Example: `assets/environments/studio.hdr`
3. Click **Load HDRI** to load the environment map
4. Adjust the **HDRI Intensity** slider to control brightness (0.1 to 5.0)

## Supported Formats
- **HDR**: Radiance RGBE format (.hdr)
- **EXR**: OpenEXR format (.exr)

## Technical Details

### New Components
- `EnvironmentComponent`: Stores environment settings (background type, color, HDRI path, intensity)
- `VulkanSkybox`: Renders environment maps as a skybox
- `VulkanTexture::LoadHDRFromFile()`: Loads HDR images with floating-point precision

### Shaders
- `skybox.vert`: Skybox vertex shader
- `skybox.frag`: Skybox fragment shader with equirectangular mapping and tone mapping

### Architecture
- Environment entity is automatically created with the scene
- Skybox renders after scene objects but before outlines
- Uses depth testing with `LESS_OR_EQUAL` to render at maximum depth
- Automatic tone mapping and gamma correction for HDR content

## Performance Notes
- HDR images are stored in `VK_FORMAT_R32G32B32A32_SFLOAT` format
- Skybox rendering is skipped when using solid color mode
- Environment maps use linear filtering for smooth appearance

## Example HDRI Sources
You can find free HDRI maps at:
- [Poly Haven](https://polyhaven.com/hdris)
- [HDRI Haven](https://hdrihaven.com/)
- Download equirectangular .hdr or .exr files

## Future Enhancements
Potential improvements:
- Cubemap support for better performance
- IBL (Image-Based Lighting) for realistic reflections
- Irradiance and specular maps for PBR materials
- Real-time HDRI preview in asset browser
- Blur/mipmap generation for environment maps
