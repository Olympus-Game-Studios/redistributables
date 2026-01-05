# Hephaestus Engine - Scripting Documentation

Welcome to the scripting documentation for Hephaestus Engine!

This directory focuses on Lua as the primary gameplay scripting language. C++ is for engine internals and native extensions.

## 📚 Quick Navigation

### 🚀 **Getting Started** (5-10 minutes)
- **[SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md)** - Start here! Step-by-step tutorials for Lua scripting
- **[WHAT_YOU_CAN_DO_NOW.md](WHAT_YOU_CAN_DO_NOW.md)** - See what's ready to use right now

### 📖 **Complete Guides** (References)
- **[SCRIPT_DEVELOPMENT_GUIDE.md](../../SCRIPT_DEVELOPMENT_GUIDE.md)** - Engine/native extension reference (C++)
- **[LUA_SCRIPTING_GUIDE.md](LUA_SCRIPTING_GUIDE.md)** - Complete Lua scripting reference
- **[LUA_INSTALLATION_GUIDE.md](LUA_INSTALLATION_GUIDE.md)** - How to install Lua on your platform

### 🏗️ **Architecture & Deep Dives** (For developers)
- **[LUA_INTEGRATION_SUMMARY.md](LUA_INTEGRATION_SUMMARY.md)** - How the scripting system is architected
- **[LUA_INTEGRATION_ROADMAP.md](LUA_INTEGRATION_ROADMAP.md)** - Implementation status and roadmap
- **[SESSION_SUMMARY_SCRIPTING.md](SESSION_SUMMARY_SCRIPTING.md)** - What was built and why

### 📋 **Reference**
- **[SCRIPTING_DOCUMENTATION_INDEX.md](SCRIPTING_DOCUMENTATION_INDEX.md)** - Complete index of all documentation
- **[FILE_MANIFEST_SCRIPTING.md](FILE_MANIFEST_SCRIPTING.md)** - List of all files created/modified

---

## 🎯 Choose Your Path

### **Path A: Start with Lua (Recommended)**
1. Read: [SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md) → Lua method
2. Time: ~5 minutes
3. Result: ✓ Writing Lua scripts immediately, fast iteration

### **Path B: Use C++ for Engine Extensions (Advanced)**
1. Read: [SCRIPT_DEVELOPMENT_GUIDE.md](../../SCRIPT_DEVELOPMENT_GUIDE.md)
2. Time: Varies
3. Result: ✓ Implement native modules or performance-critical systems

### **Path C: Learn Both (Optional)**
- Read: [WHAT_YOU_CAN_DO_NOW.md](WHAT_YOU_CAN_DO_NOW.md)
- Follow paths A and B as needed
- Time: ~20 minutes total

---

## ❓ Quick FAQ

| Question | Answer |
|----------|--------|
| **Where do I start?** | Read [SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md) |
| **Do I need to install anything?** | No — Lua is optional but recommended for scripting. See [LUA_INSTALLATION_GUIDE.md](LUA_INSTALLATION_GUIDE.md) |
| **Which should I use?** | Lua for gameplay scripting (fast iteration). Use C++ only for engine internals or performance-critical systems. |
| **Is Lua really used in games?** | Yes! Roblox, Genshin Impact, WoW. See [LUA_SCRIPTING_GUIDE.md](LUA_SCRIPTING_GUIDE.md) |
| **Can I use both on same entity?** | Yes! Perfect integration. See [LUA_INTEGRATION_SUMMARY.md](LUA_INTEGRATION_SUMMARY.md) |
| **How fast is iteration?** | C++: ~30 seconds (rebuild). Lua: ~2 seconds (restart play). |
| **What if I'm new to programming?** | C++ and Lua both have simple patterns. See examples in the quick start. |

---

## 📊 Documentation Map

```
Documentation/Scripting/
│
├── README.md (you are here)
│
├─ Getting Started
│  ├── SCRIPTING_QUICK_START.md           (5-min tutorials)
│  ├── WHAT_YOU_CAN_DO_NOW.md             (capabilities overview)
│  └── LUA_INSTALLATION_GUIDE.md          (platform-specific setup)
│
├─ Complete References
│  ├── SCRIPT_DEVELOPMENT_GUIDE.md        (C++ scripting)
│  ├── LUA_SCRIPTING_GUIDE.md             (Lua scripting)
│  └── SCRIPTING_DOCUMENTATION_INDEX.md   (master index)
│
└─ Deep Dives (for developers)
   ├── LUA_INTEGRATION_SUMMARY.md         (architecture)
   ├── LUA_INTEGRATION_ROADMAP.md         (development status)
   ├── SESSION_SUMMARY_SCRIPTING.md       (what was built)
   └── FILE_MANIFEST_SCRIPTING.md         (file changes)
```

---

## 🎮 What You Can Build

### **With Lua (Primary)**
- ✓ Game logic
- ✓ AI scripting
- ✓ Event handling
- ✓ UI callbacks
- ✓ Rapid prototyping
- ✓ No rebuild needed

### **With C++ (Engine/Optional)**
- ✓ Engine internals and performance-critical systems
- ✓ Native modules and bindings

### **Combined Approach**
- Use Lua for gameplay logic and C++ for optimized engine paths when necessary

---

## 📞 Getting Help

1. **Question about scripting?** → Check [SCRIPTING_DOCUMENTATION_INDEX.md](SCRIPTING_DOCUMENTATION_INDEX.md)
2. **C++ specific?** → See [SCRIPT_DEVELOPMENT_GUIDE.md](../../SCRIPT_DEVELOPMENT_GUIDE.md)
3. **Lua specific?** → See [LUA_SCRIPTING_GUIDE.md](LUA_SCRIPTING_GUIDE.md)
4. **Installation help?** → See [LUA_INSTALLATION_GUIDE.md](LUA_INSTALLATION_GUIDE.md)
5. **Want examples?** → Check `engine/Game/ExampleScripts.h` and `engine/Game/scripts/example.lua`

---

## 🚀 Ready to Get Started?

### **Option 1: Start with Lua right now (Recommended)**
👉 Open [SCRIPTING_QUICK_START.md](SCRIPTING_QUICK_START.md) → Lua method

### **Option 2: Setup native C++ modules (Advanced)**
👉 Open [SCRIPT_DEVELOPMENT_GUIDE.md](../../SCRIPT_DEVELOPMENT_GUIDE.md)

### **Option 3: Learn everything first**
👉 Open [WHAT_YOU_CAN_DO_NOW.md](WHAT_YOU_CAN_DO_NOW.md)

---

## 📝 Document Versions

All documentation is **version 1.0** and **production-ready**.

Last updated: November 11, 2025

---

**Happy scripting!** 🎮

Questions? Start with the quick start guide - the answers are there! 🚀
