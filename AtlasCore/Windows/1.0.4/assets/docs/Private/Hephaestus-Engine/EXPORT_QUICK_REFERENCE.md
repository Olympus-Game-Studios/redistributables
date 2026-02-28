# Export & Packaging - Quick Reference

## Quick Export (2 Steps!)

### 1. Editor Export
```
1. Open your project in Hephaestus Editor
2. Load your scene
3. Click "Export" button in toolbar
4. Export created in: <project>/dist/<project-name>_export/
```

### 2. Run Your Game!
```batch
# Navigate to export directory
cd dist\MyProject_export

# Double-click RunGame.bat or run:
RunGame.bat
```

That's it! The exported package includes everything needed to run standalone.

---

## What Gets Exported

### ✅ Automatically Included
- Scene file (.hpscene)
- All meshes referenced in scene
- All textures (albedo, normal, roughness, AO)
- All Lua scripts
- Compiled shaders (.spv)
- Export manifest

### ❌ Manual Copy Required
- Runtime executable (HephaestusEngine.exe)
- Vulkan DLLs (if needed)
- Configuration files

---

## Packaging Script Options

```powershell
# Basic validation
.\tools\package_export.ps1 -ExportPath ".\dist\export"

# Create ZIP for distribution
.\tools\package_export.ps1 -ExportPath ".\dist\export" -CreateZip

# Verbose output with file listing
.\tools\package_export.ps1 -ExportPath ".\dist\export" -Verbose
```

---

## Distribution Checklist

- [ ] Export from editor
- [ ] Run packaging script
- [ ] Copy runtime executable
- [ ] Test on development machine
- [ ] Test on clean machine (no dev tools)
- [ ] Create ZIP or installer
- [ ] Include README with requirements

---

## Troubleshooting

**"Export failed: no active project"**
→ Open a project first (File → Open Project)

**Missing assets in export**
→ Check asset paths are relative to project root
→ Built-in assets (builtin://) are excluded

**Won't run on target machine**
→ Install Vulkan runtime or bundle vulkan-1.dll
→ Install Visual C++ Redistributables
→ Run from export root directory

---

## File Locations

- **SceneExporter API:** `engine/Scene/SceneExporter.h`
- **Packaging Script:** `tools/package_export.ps1`
- **Full Documentation:** `Documentation/Features/EXPORT_PACKAGING.md`
- **Issue Tracker:** [GitHub Issue #2](https://github.com/Olympus-Game-Studios/Hephaestus-Engine/issues/2)

---

**Status:** ✅ Implemented & Tested  
**Version:** 1.0  
**Last Updated:** November 19, 2025
