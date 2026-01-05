# Asset Browser - Create Script Feature - Visual Guide

## Complete Workflow

```
┌────────────────────────────────────────────────────────────────┐
│                    HEPHAESTUS ENGINE                           │
│                   PROJECT BROWSER                              │
└────────────────────────────────────────────────────────────────┘

Step 1: Browse Projects
────────────────────────
┌──────────────────────┐  ┌──────────────────────┐
│   MyGameProject      │  │   AnotherProject     │
│  [████████████]      │  │  [████████████]      │
│                      │  │                      │
│  Last modified:      │  │  Last modified:      │
│  Nov 10, 2025        │  │  Nov 5, 2025         │
└──────────────────────┘  └──────────────────────┘
         │
         │ Right-Click on "MyGameProject"
         ▼

Step 2: Context Menu Appears
──────────────────────────────
┌──────────────────────┐
│ 🔓 Open              │  ← Open the project
│ ✨ New C++ Script... │  ← CREATE SCRIPT (NEW!)
├──────────────────────┤
│ ⭐ Add to Favorites  │
│ 📁 Open Folder       │
│ ✎ Edit Details...    │
│ 🗑️ Delete Project... │
└──────────────────────┘
         │
         │ Click "New C++ Script..."
         ▼

Step 3: Script Creation Dialog Opens
─────────────────────────────────────
┌─────────────────────────────────────────────┐
│  Create New C++ Script                  [X] │
├─────────────────────────────────────────────┤
│                                             │
│  Project: MyGameProject                     │
│                                             │
│  Script Name:                               │
│  ┌───────────────────────────────────────┐  │
│  │ PlayerController                  [X] │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  (Will be created in project root           │
│   with .h and .cpp files)                   │
│                                             │
│  ┌──────────┐  ┌────────────┐              │
│  │ ✓ Create │  │ × Cancel   │              │
│  └──────────┘  └────────────┘              │
│                                             │
└─────────────────────────────────────────────┘
         │
         │ Click Create
         ▼

Step 4: Files Generated
────────────────────────
Files created automatically:

📁 MyGameProject/
   📁 Scripts/
      ├─ 📄 PlayerController.h
      └─ 📄 PlayerController.cpp

Status: "Script 'PlayerController' created successfully!" ✓
(Message shown for 3 seconds)

         │
         │ Ready to edit and use!
         ▼

Step 5: Use in Your Game
────────────────────────
1. Edit PlayerController.h (add your logic)
2. Register in main.cpp:
   ScriptRegistry::Register<PlayerController>(...)
3. Attach to entities:
   scriptEngine.AttachScript(entity, script, "PlayerController")
```
> DEPRECATED: C++ gameplay scripting features are deprecated. Use Lua scripts and the Asset Browser's "New Lua Script..." workflow. This document is retained for legacy reference only.

## Generated File Structure

### PlayerController.h
```
┌─────────────────────────────────────────────┐
│ Class Definition                            │
├─────────────────────────────────────────────┤
│ • Inherits from ScriptBase                  │
│ • Constructor taking Entity and Scene*      │
│ • Virtual destructor                        │
│ • OnAwake()       - Initialization          │
│ • OnUpdate(dt)    - Main game logic         │
│ • OnLateUpdate()  - Post-update logic       │
│ • OnEnable()      - When enabled            │
│ • OnDisable()     - When disabled           │
│ • OnDestroy()     - Cleanup                 │
│ • Private members - Add your data           │
└─────────────────────────────────────────────┘
```

### PlayerController.cpp
```
┌─────────────────────────────────────────────┐
│ Implementation File                         │
├─────────────────────────────────────────────┤
│ #include "PlayerController.h"               │
│                                             │
│ // Ready for out-of-line implementations    │
│ // Add complex method definitions here      │
│                                             │
│ (Empty template for quick setup)            │
└─────────────────────────────────────────────┘
```

## Dialog Flow Diagram

```
User Right-Clicks Project
         ↓
Context Menu Displayed
         ↓
User Selects "New C++ Script..."
         ↓
    ┌────────────────────────┐
    │ Dialog Opens           │
    │ Script Name = ""       │
    └────────────────────────┘
         ↓
    User Types Name
    ↓
    Empty? ──Yes──→ Error: "Please enter a script name"
    ↓ No                     ↑
    |__________________________|
         ↓
    User Clicks Create
         ↓
    ┌─────────────────────────┐
    │ CreateCppScript()       │
    │ Called                  │
    └─────────────────────────┘
         ↓
    Create Scripts/ folder?
    ├─ Success → Write .h file
    │             Write .cpp file
    │             Success? 
    │             ├─ Yes → Status: "Created successfully!"
    │             │        Close dialog
    │             │        Show message 3 sec
    │             └─ No  → Error: "Failed to create script..."
    │
    └─ Failure → Error: "Failed to create script..."
```

## Code Integration Points

### ProjectManager.h Changes
```cpp
// New method to draw dialog
void DrawNewScriptDialog();

// New method to create script files
bool CreateCppScript(const std::filesystem::path& projectPath, 
                     const std::string& scriptName);

// New UI state
bool m_ShowNewScriptDialog = false;
char m_NewScriptNameBuffer[128] = {};
ProjectInfo* m_ScriptDialogProject = nullptr;
```

### ProjectManager.cpp Changes
```cpp
// In context menu
if (ImGui::MenuItem("New C++ Script...")) {
    m_ScriptDialogProject = const_cast<ProjectInfo*>(&project);
    m_ShowNewScriptDialog = true;
    memset(m_NewScriptNameBuffer, 0, sizeof(m_NewScriptNameBuffer));
}

// In Draw() function
if (m_ShowNewScriptDialog) {
    DrawNewScriptDialog();
}
```

## User Experience Timeline

```
TIME  ACTION                              UI FEEDBACK
────  ──────                              ────────────
 0s   Right-click project                 Context menu appears
 1s   Click "New C++ Script..."            Dialog opens, input focused
 2s   Type "PlayerController"              Text entered in field
 3s   Click Create                         Files being created...
 4s   (Files written to disk)              ✓ "Script created successfully!"
 7s   (Message timeout)                    Dialog closes
```

## Error Scenarios

### Scenario 1: Empty Name
```
User clicks Create without entering name
         ↓
   Validation fails
         ↓
   Status Message: ⚠️ "Please enter a script name"
   (Shown for 2 seconds, dialog stays open)
         ↓
   User can try again
```

### Scenario 2: Write Failure
```
Project folder read-only (unusual case)
         ↓
   CreateCppScript() returns false
         ↓
   Error Message: ❌ "Failed to create script 'PlayerController'"
   (Shown for 3 seconds, dialog stays open)
         ↓
   User can check permissions and retry
```

### Scenario 3: Success
```
Files created successfully
         ↓
   CreateCppScript() returns true
         ↓
   Status Message: ✓ "Script 'PlayerController' created successfully!"
   (Shown for 3 seconds)
         ↓
   Dialog automatically closes
   (User ready to use new script)
```

## File Generation Process

```
Input: scriptName = "PlayerController"
       projectPath = "C:/Projects/MyGame"

┌──────────────────────────────────────┐
│ Step 1: Create Scripts Directory      │
│ Path: C:/Projects/MyGame/Scripts/     │
│ Status: Created (or already exists)   │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Step 2: Generate Header Content      │
│ Template:                            │
│ - Include guards                     │
│ - ScriptBase inherit                 │
│ - All lifecycle methods              │
│ - Private member section             │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Step 3: Write PlayerController.h     │
│ Path: .../Scripts/PlayerController.h │
│ Status: Written (1.2 KB)             │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Step 4: Generate Impl Content        │
│ Template:                            │
│ - Include header                     │
│ - Comments for future expansion      │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Step 5: Write PlayerController.cpp   │
│ Path: .../Scripts/PlayerController.cpp
│ Status: Written (0.3 KB)             │
└──────────────────────────────────────┘
         ↓
      Success!
```

## Template Content Preview

### Header Template (Simplified)
```cpp
#pragma once
#include "engine/Scripting/ScriptBase.h"

class PlayerController : public ScriptBase {
public:
    PlayerController(Entity entity, Scene* scene) { ... }
    ~PlayerController() = default;
    
    void OnAwake() override { ... }
    void OnUpdate(float deltaTime) override { ... }
    void OnLateUpdate(float deltaTime) override { ... }
    void OnEnable() override { ... }
    void OnDisable() override { ... }
    void OnDestroy() override { ... }
    
private:
    // Add members here
};
```

### Impl Template (Simplified)
```cpp
#include "PlayerController.h"

// Add implementation details here
```

## Next Steps After Creation

```
Created: PlayerController.h/.cpp
         ↓
    ┌───┴────────┬────────────┬─────────┐
    ↓            ↓            ↓         ↓
 Edit         Register     Attach    Attach
 Script       in main()    to Entity  to more
 (Add         ScriptReg.   scriptEng. Entities
  logic)      Register()   .Attach()
    ↓            ↓            ↓         ↓
    └───┬────────┴────────────┴─────────┘
        ↓
    Run Game & Test
```

---

This visual guide shows the complete workflow for creating scripts directly from the project browser!
