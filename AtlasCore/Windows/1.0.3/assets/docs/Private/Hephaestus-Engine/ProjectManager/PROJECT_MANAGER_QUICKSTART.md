````markdown
# Quick Start: Integrating the New Project Manager

## 🎯 Simple Integration Steps

### Step 1: Add Include
At the top of `main.cpp`, add:
```cpp
#include "../UI/ProjectManager.h"
```

### Step 2: Declare Global Instance
After other global variables (around line 105):
```cpp
static HephaestusEngine::ProjectManager g_ProjectManager;
```

### Step 3: Initialize (in main function)
After ImGui initialization, before main loop:
```cpp
// Initialize Project Manager
g_ProjectManager.Initialize(&vkDevice);
g_ProjectManager.SetProjectsRoot(ResolveProjectsRoot());
g_ProjectManager.RefreshProjects();
```

### Step 4: Use in Main Loop
Replace the existing `DrawProjectBrowser()` call with:
```cpp
if (!g_ProjectSelected) {
    // Show modern project manager
    std::optional<std::filesystem::path> selectedProject = g_ProjectManager.Draw();
    
    if (selectedProject.has_value()) {
        SetActiveProjectRoot(selectedProject.value());
        g_ProjectSelected = true;
        g_AssetBrowserNeedsReset = true;
        
        // Optional: Load initial scene or setup
        // CreateDefaultScene();
    }
} else {
    // Normal editor UI
    // ... existing editor code ...
}
```

### Step 5: Cleanup (before shutdown)
Before destroying Vulkan resources:
```cpp
g_ProjectManager.Shutdown();
```

---

## 🔧 Alternative: Side-by-Side Comparison

To test the new project manager alongside the old one:

```cpp
// Add toggle
static bool g_UseNewProjectManager = true;

// In main loop
if (!g_ProjectSelected) {
    std::optional<std::filesystem::path> selectedProject;
    
    if (g_UseNewProjectManager) {
        selectedProject = g_ProjectManager.Draw();
    } else {
        selectedProject = DrawProjectBrowser(); // Old version
    }
    
    if (selectedProject.has_value()) {
        SetActiveProjectRoot(selectedProject.value());
        g_ProjectSelected = true;
    }
}

// Add toggle in debug menu
if (ImGui::BeginMenu("Debug")) {
    ImGui::Checkbox("Use New Project Manager", &g_UseNewProjectManager);
    ImGui::EndMenu();
}
```

---

## 🎨 Customization Examples

### Change Theme Colors
```cpp
// After g_ProjectManager.Initialize()
// Access members directly or add setter methods

// In ProjectManager.h, make colors public or add setters:
public:
    void SetAccentColor(ImVec4 color) { m_ColorAccent = color; }
    void SetCardBackground(ImVec4 color) { m_ColorCardBg = color; }
```

### Add Custom Template
```cpp
// After initialization
auto& templates = const_cast<std::vector<ProjectTemplate>&>(
    g_ProjectManager.GetTemplates()
);

ProjectTemplate vfxTemplate;
vfxTemplate.name = "VFX Template";
vfxTemplate.description = "Template for visual effects and particles";
vfxTemplate.include3DDefaults = true;
vfxTemplate.folders = {
    "assets/particles",
    "assets/shaders",
    "assets/vfx"
};
templates.push_back(vfxTemplate);
```

---

## 📝 Complete Example

Here's a minimal complete example:

```cpp
#include "../UI/ProjectManager.h"

// Global
static HephaestusEngine::ProjectManager g_ProjectManager;

int main() {
    // ... GLFW and Vulkan setup ...
    
    // Initialize Project Manager
    g_ProjectManager.Initialize(&vkDevice);
    g_ProjectManager.SetProjectsRoot(ResolveProjectsRoot());
    g_ProjectManager.RefreshProjects();
    
    // Main loop
    while (!glfwWindowShouldClose(window)) {
        glfwPollEvents();
        
        // ImGui frame
        ImGui_ImplVulkan_NewFrame();
        ImGui_ImplGlfw_NewFrame();
        ImGui::NewFrame();
        
        if (!g_ProjectSelected) {
            // Project Manager
            auto selected = g_ProjectManager.Draw();
            if (selected.has_value()) {
                SetActiveProjectRoot(selected.value());
                g_ProjectSelected = true;
            }
        } else {
            // Editor UI
            ImGui::DockSpaceOverViewport(ImGui::GetMainViewport());
            
            // Your editor windows here
            DrawSceneHierarchy();
            DrawViewport();
            DrawProperties();
            DrawAssetBrowser();
            // etc.
        }
        
        // Render
        ImGui::Render();
        // ... Vulkan rendering ...
    }
    
    // Cleanup
    g_ProjectManager.Shutdown();
    
    // ... rest of cleanup ...
    return 0;
}
```

---

## 🐛 Troubleshooting

### Build Errors

**Error:** `ProjectManager.h not found`
- **Fix:** Check CMakeLists.txt includes `engine/UI/ProjectManager.cpp`
- Rebuild project: `cmake --build build --config Release`

**Error:** `VulkanDevice* not defined`
- **Fix:** Make sure VulkanDevice is defined before ProjectManager usage
- Include order: VulkanDevice.h before ProjectManager.h

### Runtime Issues

**Issue:** Projects not showing
- **Check:** Projects root directory exists and has permissions
- **Fix:** Call `RefreshProjects()` after setting root
- **Debug:** Add logging in `RefreshProjects()`

**Issue:** Thumbnails not loading
- **Note:** Thumbnail loading is not yet implemented
- **Future:** Will load from `.hephaestus/thumbnail.png`

**Issue:** Crash on shutdown
- **Fix:** Call `g_ProjectManager.Shutdown()` before destroying Vulkan resources
- Make sure to clean up in correct order

---

## 💡 Pro Tips

1. **Save Window State**: The project manager fills the entire window. Make sure to call it before docking setup.

2. **Metadata Updates**: Project metadata auto-updates on filesystem changes, but you can manually trigger refresh.

3. **Custom Icons**: Add icons to `m_Icons` map in `LoadIcons()` for better visuals.

4. **Async Loading**: For large project lists, consider async thumbnail loading.

5. **Error Handling**: The manager handles most errors gracefully with user-friendly messages.

---

## 🚀 Next Steps

After integration, consider:

1. **Add Thumbnail Generation**n   - Capture scene viewport
   - Save to `.hephaestus/thumbnail.png`
   - Auto-update on save

2. **Implement Project Settings**n   - Edit dialog for metadata
   - Version control integration
   - Custom properties

3. **Add Recent Files**n   - Track recently opened scenes
   - Quick access in sidebar

4. **Cloud Features**n   - Sync metadata
   - Cloud backup status
   - Collaboration indicators

---

## 📚 Related Documentation

- [PROJECT_MANAGER_INTEGRATION.md](PROJECT_MANAGER_INTEGRATION.md) - Full API reference
- [PROJECT_MANAGER_COMPARISON.md](PROJECT_MANAGER_COMPARISON.md) - Before/after comparison
- [ProjectManager.h](../engine/UI/ProjectManager.h) - Header file
- [ProjectManager.cpp](../engine/UI/ProjectManager.cpp) - Implementation

Happy coding! 🎮✨

````