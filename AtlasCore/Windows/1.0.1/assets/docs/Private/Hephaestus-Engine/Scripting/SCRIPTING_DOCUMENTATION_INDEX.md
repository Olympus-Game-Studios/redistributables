# Scripting Documentation Index

Welcome to the Hephaestus Engine scripting documentation! This index guides you to the right documentation for your needs.

## 🚀 Getting Started (Pick One)

### **I'm new to scripting**
→ Read **[SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md)**
- 5-minute introduction
- Side-by-side examples
- Common tasks explained

### **I want to extend the engine or write native modules (C++)**
→ Read **[SCRIPT_DEVELOPMENT_GUIDE.md](SCRIPT_DEVELOPMENT_GUIDE.md)**
- Engine/extension reference (not recommended for gameplay scripts)
- Use for engine internals and performance-critical modules

### **I want to write Lua scripts (fast iteration)**
→ First: **[LUA_INSTALLATION_GUIDE.md](LUA_INSTALLATION_GUIDE.md)**
→ Then: **[LUA_SCRIPTING_GUIDE.md](LUA_SCRIPTING_GUIDE.md)**
- Installation steps for your OS
- Complete Lua API reference
- Lifecycle and bindings
- Performance tips

---

## 📚 Complete Documentation

### Quick Reference (5-10 minutes)

| Guide | Purpose | Read Time |
|-------|---------|-----------|
| [SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md) | Get started with Lua scripting | 5 min |
| [LUA_SCRIPTING_GUIDE.md](LUA_SCRIPTING_GUIDE.md) | Lua scripting | 15 min |

### Setup & Installation (5-30 minutes)

| Guide | Purpose | Platform |
|-------|---------|----------|
| [LUA_INSTALLATION_GUIDE.md](LUA_INSTALLATION_GUIDE.md) | Install Lua | Windows, Linux, macOS |

### Architecture & Reference (15-30 minutes)

| Guide | Purpose | Audience |
|-------|---------|----------|
| [LUA_INTEGRATION_SUMMARY.md](LUA_INTEGRATION_SUMMARY.md) | Architecture overview | Engine developers |
| [LUA_INTEGRATION_ROADMAP.md](LUA_INTEGRATION_ROADMAP.md) | Implementation status | Contributors |
| [SESSION_SUMMARY_SCRIPTING.md](SESSION_SUMMARY_SCRIPTING.md) | What was built | Project stakeholders |

---

## 🎯 Common Questions

### "Can I write scripts without modifying the engine?"
✓ **Yes!** Use Lua scripts and follow [SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md)

### "How do I attach a script to an entity?"
→ [SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md) - Step 4

### "Which should I use, C++ or Lua?"
→ Use Lua for gameplay scripting (fast iteration). Reserve C++ for engine internals and performance-critical code.

### "How do I iterate faster?"
→ Use Lua! See [LUA_INSTALLATION_GUIDE.md](LUA_INSTALLATION_GUIDE.md)

### "Is Lua really used in AAA games?"
✓ Yes! Roblox, Genshin Impact, World of Warcraft use Lua. See [LUA_SCRIPTING_GUIDE.md](LUA_SCRIPTING_GUIDE.md)

### "Do native C++ modules run during play mode?"
✓ Native modules can run during play mode. See [SCRIPT_DEVELOPMENT_GUIDE.md](SCRIPT_DEVELOPMENT_GUIDE.md) for engine/extension guidance. Note: gameplay scripts should use Lua.

### "Can I have both Lua and legacy native modules on the same entity?"
✓ Legacy native modules may coexist, but gameplay scripting should use Lua. See [LUA_INTEGRATION_SUMMARY.md](LUA_INTEGRATION_SUMMARY.md) for integration notes.

### "What's the performance difference?"
→ See performance table in [LUA_SCRIPTING_GUIDE.md](LUA_SCRIPTING_GUIDE.md)

---

## 📖 Learning Path

### Beginner (0-30 minutes)
1. Read [SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md)
2. Try Example 1: Simple Lua script (5 minutes)
3. Try Example 2: Move entity in script (5 minutes)

### Intermediate (30 minutes - 1 hour)
1. Complete beginner path
2. Read [LUA_SCRIPTING_GUIDE.md](LUA_SCRIPTING_GUIDE.md)
3. Write your first game mechanic in Lua
4. Test it in play mode

### Advanced (1-2 hours)
1. Complete intermediate path
2. Install Lua: [LUA_INSTALLATION_GUIDE.md](LUA_INSTALLATION_GUIDE.md)
3. Read [LUA_SCRIPTING_GUIDE.md](LUA_SCRIPTING_GUIDE.md)
4. Rewrite your mechanic in Lua
5. Compare iteration speed
6. Use both approaches strategically

### Expert (For contributors)
1. Read [LUA_INTEGRATION_ROADMAP.md](LUA_INTEGRATION_ROADMAP.md)
2. Understand architecture from [LUA_INTEGRATION_SUMMARY.md](LUA_INTEGRATION_SUMMARY.md)
3. Implement Lua bindings (see roadmap)
4. Add new features to scripting system

---

## 🔧 Quick Command Reference

### Create Lua Script
```lua
-- File: engine/Game/scripts/my_script.lua
function onUpdate(deltaTime)
    print("Running...")
end
```

### Create Lua Script
```lua
-- File: engine/Game/scripts/my_script.lua
function onUpdate(deltaTime)
    print("Running...")
end
```

### Attach Script via UI
1. Select entity in scene
2. Scroll to Scripts section in Details Panel
3. Click "Attach Script"
4. Select script
5. Done!

---

## 🐛 Troubleshooting

### Native module doesn't run
**Solution**: 
- Check [SCRIPT_DEVELOPMENT_GUIDE.md](SCRIPT_DEVELOPMENT_GUIDE.md) - Registration/initialization section
- Verify module is registered and built into the engine
- Check play mode is enabled

### Lua script doesn't load
**Solution**:
- Is Lua installed? Check startup message
- If not: Follow [LUA_INSTALLATION_GUIDE.md](LUA_INSTALLATION_GUIDE.md)
- If yes: Check script file path

### Script file not found
**Solution**:
- Verify path is correct (e.g., `engine/Game/scripts/my_script.lua`)
- Check file exists in file explorer
- Use absolute path if relative doesn't work

### Performance is slow
**Solution**:
- Move compute-heavy code to C++
- Use Lua for UI/input, C++ for physics
- See performance tips in [LUA_SCRIPTING_GUIDE.md](LUA_SCRIPTING_GUIDE.md)

### Script runs every frame but I want once
**Solution**:
- Use a flag in onAwake
- Toggle it after first execution
- Example in [SCRIPT_DEVELOPMENT_GUIDE.md](SCRIPT_DEVELOPMENT_GUIDE.md)

---

## 📞 Support & Resources

### Official Lua Resources
- **Lua Manual**: https://www.lua.org/manual/
- **Lua Learning**: https://www.lua.org/pil/
- **Lua Community**: https://www.lua.org/community.html

### Engine Resources
- **Main README**: See Scripting section in root README.md
- **Example Scripts**: `engine/Game/ExampleScripts.h`
- **Example Lua**: `engine/Game/scripts/example.lua`

### Documentation Files Location
```
/ (root)
├── README.md                           (Main repo overview)
├── SCRIPTING_QUICK_START.md            (Start here!)
├── SCRIPT_DEVELOPMENT_GUIDE.md         (C++ reference)
├── LUA_SCRIPTING_GUIDE.md              (Lua reference)
├── LUA_INSTALLATION_GUIDE.md           (Setup Lua)
├── LUA_INTEGRATION_SUMMARY.md          (Architecture)
├── LUA_INTEGRATION_ROADMAP.md          (Dev status)
├── SESSION_SUMMARY_SCRIPTING.md        (What was built)
└── Documentation/
    └── (Other engine docs)
```

---

## 🎓 Learning Resources by Topic

### Understanding the Scripting System
1. [SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md) - Overview
2. [LUA_INTEGRATION_SUMMARY.md](LUA_INTEGRATION_SUMMARY.md) - Architecture
3. [SESSION_SUMMARY_SCRIPTING.md](SESSION_SUMMARY_SCRIPTING.md) - What was built

### Writing Your First Script
1. [SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md) - Step 1-4
2. [SCRIPT_DEVELOPMENT_GUIDE.md](SCRIPT_DEVELOPMENT_GUIDE.md) - Complete reference
3. `engine/Game/ExampleScripts.h` - Real examples

### Transitioning to Lua
1. [LUA_INSTALLATION_GUIDE.md](LUA_INSTALLATION_GUIDE.md) - Setup
2. [LUA_SCRIPTING_GUIDE.md](LUA_SCRIPTING_GUIDE.md) - Learn Lua API
3. [SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md) - Method 2
4. `engine/Game/scripts/example.lua` - Example

### Performance Optimization
- [LUA_SCRIPTING_GUIDE.md](LUA_SCRIPTING_GUIDE.md) - Performance tips
- [SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md) - C++ vs Lua table
- [LUA_INTEGRATION_SUMMARY.md](LUA_INTEGRATION_SUMMARY.md) - Architecture

### Contributing to Scripting System
1. [LUA_INTEGRATION_ROADMAP.md](LUA_INTEGRATION_ROADMAP.md) - What's needed
2. [SESSION_SUMMARY_SCRIPTING.md](SESSION_SUMMARY_SCRIPTING.md) - Current state
3. Look at `engine/Scripting/` source code

---

## ✅ Verification Checklist

### Before You Start
- [ ] Engine builds successfully
- [ ] You can see the editor UI

### After Reading Quick Start
- [ ] You understand C++ vs Lua differences
- [ ] You know how to attach a script
- [ ] You know what lifecycle hooks are

### After First C++ Script
- [ ] Script compiles
- [ ] Script attaches via UI
- [ ] Script runs during play mode
- [ ] You can see output in console

### After First Lua Script
- [ ] Lua is installed on your system
- [ ] Build auto-detects Lua (check startup message)
- [ ] Script file exists
- [ ] Script attaches and runs
- [ ] You feel the iteration speed difference

---

## 📝 Document Versions

| Document | Version | Status |
|----------|---------|--------|
| SCRIPTING_QUICK_START.md | 1.0 | Complete |
| SCRIPT_DEVELOPMENT_GUIDE.md | 1.0 | Complete |
| LUA_SCRIPTING_GUIDE.md | 1.0 | Complete |
| LUA_INSTALLATION_GUIDE.md | 1.0 | Complete |
| LUA_INTEGRATION_SUMMARY.md | 1.0 | Complete |
| LUA_INTEGRATION_ROADMAP.md | 1.0 | Complete |
| SESSION_SUMMARY_SCRIPTING.md | 1.0 | Complete |
| SCRIPTING_DOCUMENTATION_INDEX.md | 1.0 | Current |

---

## 🎉 Ready to Get Started?

**Choose your path**:

### 🚀 **I want to script NOW** (C++)
→ [SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md) **Method 1**

### ⚡ **I want fast iteration** (Lua)
→ [LUA_INSTALLATION_GUIDE.md](LUA_INSTALLATION_GUIDE.md) → [SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md) **Method 2**

### 🧠 **I want to understand everything**
→ [LUA_INTEGRATION_SUMMARY.md](LUA_INTEGRATION_SUMMARY.md)

---

**Happy scripting! 🎮**

Questions? Check the troubleshooting sections or re-read the relevant guide. The answer is usually there!
