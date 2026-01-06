# Scene Export & Packaging Guide

**Status:** ✅ Implemented  
**Issue:** [#2 - Editor export & packaging](https://github.com/Olympus-Game-Studios/Hephaestus-Engine/issues/2)  
**Last Updated:** November 19, 2025

---

## Overview

The Hephaestus Engine editor includes an export system that creates distributable runtime packages. The export process collects all assets referenced by your scene and copies them to a structured output directory suitable for distribution to end users.

---

## Quick Start

### 1. Export from Editor

1. Open your project in the Hephaestus Editor
2. Load the scene you want to export
3. Click the **Export** button in the toolbar
4. The export will be created in `<project>/dist/<project-name>_export/`

### 2. Validate & (Optionally) Zip

After exporting from the editor, you can run the packaging script to validate files and produce a distributable archive:

```powershell
.\tools\package_export.ps1 -ExportPath ".\dist\MyProject_export" -ProjectName "MyProject"
```

To create a ZIP archive for distribution in one step:

```powershell
.\tools\package_export.ps1 -ExportPath ".\dist\MyProject_export" -ProjectName "MyProject" -CreateZip
```

### 3. Run Your Game

The runtime executable and launcher are included automatically. Launch the exported build by double-clicking `RunGame.bat` or running:

```batch
cd dist\MyProject_export
HephaestusEngine.exe --runtime
```

---

## Export Structure

The export creates the following directory structure:

```
<project-name>_export/
├── HephaestusEngine.exe           # Auto-detected runtime build
├── RunGame.bat                    # Launcher that enforces runtime mode
├── assets/
│   ├── scenes/
│   │   └── YourScene.hpscene
│   ├── meshes/
│   │   └── (your mesh files)
│   ├── textures/
│   │   └── (your texture files)
│   └── scripts/
│       └── (your Lua/C++ scripts)
├── shaders/
│   ├── triangle.vert.spv
│   ├── triangle.frag.spv
│   └── (other compiled shaders)
├── export_manifest.txt
└── PACKAGE_MANIFEST.txt (after validation)
```

---

## What Gets Exported

### Automatically Included

The export system automatically collects and copies:

- ✅ **Runtime executable** - Latest `HephaestusEngine.exe` build
- ✅ **Launcher** - `RunGame.bat` helper (enforces runtime mode & scene selection)
- ✅ **Scene file** (.hpscene) - The current scene state
- ✅ **Mesh assets** - All meshes referenced by MeshRendererComponents
- ✅ **Textures** - All texture files from MaterialComponents
  - Albedo/Base Color textures
  - Normal maps
  - Roughness maps
  - Ambient Occlusion maps
- ✅ **Lua scripts** - All scripts attached to entities
- ✅ **Shaders** - Compiled SPIR-V shaders (.spv files)
- ✅ **Manifest** - List of all exported assets with metadata

### Not Automatically Included

You must manually copy these to the export directory when required by your project:

- ❌ **Vulkan DLLs** - If not system-installed
- ❌ **C++ runtime** - If not system-installed
- ❌ **Configuration files** - settings.ini, imgui.ini, etc.

### Excluded from Export

The following are never exported (built-in resources):

- Resources with `builtin://` prefix (cube, sphere primitives)
- Editor-only assets
- Intermediate build files

---

## Export Options

The `SceneExporter` class supports these options:

```cpp
SceneExporter::ExportOptions options;
options.outputDirectory = "F:/MyGame/dist";
options.projectName = "MyGame";
options.includeShaders = true;      // Copy compiled shaders
options.createManifest = true;       // Generate manifest file
options.compressToArchive = false;   // Reserved for future use
```

---

## Packaging Script Reference

### Basic Usage

```powershell
.\tools\package_export.ps1 -ExportPath ".\dist\export" -ProjectName "MyProject"
```

### Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `-ExportPath` | No | `.\dist` | Path to the export directory |
| `-ProjectName` | No | `HephaestusProject` | Name of your project |
| `-CreateZip` | No | `false` | Create a ZIP archive for distribution |
| `-Verbose` | No | `false` | Show detailed file listing |

### Example: Full Packaging Workflow

```powershell
# 1. Export from editor (click Export button)
# 2. Validate and create package
.\tools\package_export.ps1 -ExportPath ".\dist\MyGame_export" -ProjectName "MyGame" -Verbose

# 3. Smoke-test runtime launch
.\dist\MyGame_export\RunGame.bat

# 4. Create distribution archive
\.\tools\package_export.ps1 -ExportPath ".\dist\MyGame_export" -ProjectName "MyGame" -CreateZip
```

---

## Validation Checks

The packaging script validates:

1. ✅ Runtime executable presence
2. ✅ Shaders directory and compiled shader files
3. ✅ Scene files (.hpscene)
4. ✅ Assets directory structure
5. ✅ Export manifest
6. ⚠️ Runtime DLLs (warns if missing)

**Exit Codes:**
- `0` - Validation passed
- `1` - Validation failed or warnings present

---

## Distribution Checklist

Before distributing your packaged game:

- [ ] Export completed successfully from editor
- [ ] Ran packaging script without errors
- [ ] Verified `RunGame.bat` launches runtime-only experience
- [ ] Tested on development machine
- [ ] **Tested on clean machine** (no dev tools installed)
- [ ] Verified Vulkan runtime is available or bundled
- [ ] Created installer or ZIP for end users
- [ ] Included README with system requirements
- [ ] Included license and credits

---

## Troubleshooting

### "Export failed: no active project"

**Solution:** Open a project before exporting. Go to File → Open Project or create a new project.

### Missing assets in export

**Problem:** Textures or meshes not copied.

**Solutions:**
- Ensure assets are properly referenced in MaterialComponents and MeshRendererComponents
- Check that asset paths are relative to the project root
- Verify files exist in the `assets/` directory
- Built-in assets (builtin://) are intentionally excluded

### Runtime executable not found

**Problem:** Validation script reports missing .exe

**Solutions:**
- Ensure you built the engine (`cmake --build build --config Release`) before exporting
- Re-run the export so the latest executable is copied alongside assets
- Confirm antivirus or backup tools did not quarantine `HephaestusEngine.exe`

### Application won't run on target machine

**Common causes:**
1. Missing Vulkan runtime - Install Vulkan SDK or bundle `vulkan-1.dll`
2. Missing C++ runtime - Install Visual C++ Redistributables
3. Missing assets - Check PACKAGE_MANIFEST.txt for required files
4. Incorrect working directory - Run from export root directory

---

## Advanced: Custom Export Workflow

### Programmatic Export (C++)

```cpp
#include "Scene/SceneExporter.h"

// Configure export
SceneExporter::ExportOptions options;
options.outputDirectory = "F:/Distribution/MyGame";
options.projectName = "MyGame";
options.includeShaders = true;
options.createManifest = true;

// Perform export
SceneExporter::ExportResult result = SceneExporter::Export(scene, options);

if (result.success) {
    std::cout << "Exported " << result.exportedAssets.size() << " files\n";
    std::cout << "Manifest: " << result.manifestPath << "\n";
} else {
    std::cerr << "Export failed: " << result.errorMessage << "\n";
}
```

### Custom Packaging Script

You can extend `package_export.ps1` or create your own:

```powershell
# Custom post-export processing
$exportDir = ".\dist\MyGame_export"

# Copy additional runtime files
Copy-Item ".\ThirdParty\vulkan-1.dll" $exportDir
Copy-Item ".\LICENSE.txt" $exportDir
Copy-Item ".\README_GAME.md" "$exportDir\README.md"

# Create installer (example with NSIS, Inno Setup, etc.)
# makensis /DAPP_NAME="MyGame" /DAPP_VERSION="1.0" installer.nsi
```

---

## Related Documentation

- [Asset Pipeline](../Features/ASSET_PIPELINE.md) - How assets are managed
- [Scene Serialization](../Reference/SCENE_SERIALIZATION.md) - Scene file format
- [Build System](../Guides/BUILD_SYSTEM.md) - Building the engine
- [Project Structure](../Architecture/PROJECT_STRUCTURE.md) - Directory layout

---

## API Reference

### SceneExporter Class

**Header:** `engine/Scene/SceneExporter.h`

#### Methods

```cpp
static ExportResult Export(const Scene& scene, const ExportOptions& options);
```

Exports a scene and all referenced assets to a directory.

**Parameters:**
- `scene` - The scene to export
- `options` - Export configuration

**Returns:** `ExportResult` with success status, error messages, and list of exported files

#### Structures

**ExportOptions:**
```cpp
struct ExportOptions {
    std::filesystem::path outputDirectory;  // Where to export
    std::string projectName;                // Project identifier
    bool includeShaders = true;             // Copy shader files
    bool createManifest = true;             // Generate manifest
    bool compressToArchive = false;         // Future: ZIP compression
};
```

**ExportResult:**
```cpp
struct ExportResult {
    bool success;                                    // Overall success status
    std::string errorMessage;                        // Error details if failed
    std::vector<std::filesystem::path> exportedAssets; // List of exported files
    std::filesystem::path manifestPath;              // Path to generated manifest
};
```

---

## Future Enhancements

Potential improvements for future releases:

- [ ] **Dependency bundling** - Auto-detect and bundle required DLLs
- [ ] **Multi-scene export** - Export multiple scenes in one package
- [ ] **Compression** - Built-in ZIP archive creation
- [ ] **Platform-specific exports** - Windows, macOS, Linux targets
- [ ] **Incremental export** - Only copy changed files
- [ ] **Export profiles** - Save/load export configurations
- [ ] **Build integration** - Trigger builds before export

---

## Feedback & Contributions

Found an issue with the export system? Have suggestions for improvements?

- **Report bugs:** [GitHub Issues](https://github.com/Olympus-Game-Studios/Hephaestus-Engine/issues)
- **Contribute:** See [CONTRIBUTING.md](../../CONTRIBUTING.md)
- **Discuss:** Join our community forum

---

**Document Version:** 1.0  
**Feature Status:** Stable  
**Tested On:** Windows 11, Vulkan SDK 1.3+
