# What You Can Do Now: Lua Is The Primary Scripting System

## 🎉 Great News!

Hephaestus Engine now provides a production-ready Lua-based scripting system. Lua is the primary supported scripting language for game logic and iteration. C++-based scripting is deprecated for gameplay scripting — use Lua for scripts and reserve C++ for engine internals or performance-critical subsystems.

---

## ✅ What's Ready RIGHT NOW

### Lua Scripting (Primary)
Write game code in Lua and iterate quickly without recompilation:

```lua
-- Scripts/player_controller.lua
function onAwake()
    -- Initialization code
end

function onUpdate(deltaTime)
    -- Per-frame logic
end

function onDestroy()
    -- Cleanup
end
```

✓ **Instant feedback** - no rebuild needed
✓ **Primary, recommended workflow** for gameplay scripting
✓ **Full lifecycle hooks** (onAwake, onUpdate, onLateUpdate, onDestroy)
✓ **Editor integration** - attach Lua scripts via the Details Panel

**Get started**: Read `SCRIPTING_QUICK_START.md` → Method 2 for the Lua workflow.

---

## ⚠️ C++ Scripting (Deprecated)

C++-based gameplay scripting is deprecated in this repository. It remains possible to implement engine-level code or extend the engine in C++, but Lua should be used for game scripts going forward. New documentation and examples prioritize Lua.

If you have existing C++ script templates or workflows, migrate gameplay logic to Lua for faster iteration and maintainability.

---

## 🚀 Quick Start

### Recommended: Start with Lua (0–5 minutes)
1. Read `LUA_INSTALLATION_GUIDE.md` if you need Lua installed (optional for many workflows).
2. Open `SCRIPTING_QUICK_START.md` → Method 2 (Lua examples)
3. Create `Scripts/your_script.lua` and attach via the editor
4. Press Play — iterate quickly

**Iteration time**: ~2 seconds per change (edit script, save, hot-reload)

### When to use C++
- Use C++ only for engine changes or performance-critical systems (physics, rendering). Gameplay logic should go into Lua.

---

## 📚 Your Documentation Library

| Need | Read This |
|------|-----------|
| Quick start (Lua) | `SCRIPTING_QUICK_START.md` |
| Lua reference | `LUA_SCRIPTING_GUIDE.md` |
| Install Lua | `LUA_INSTALLATION_GUIDE.md` |
| How Lua is integrated | `LUA_INTEGRATION_SUMMARY.md` |
| Full index | `SCRIPTING_DOCUMENTATION_INDEX.md` |

---

## 🎮 What You Can Build

### With Lua (Primary)
✓ Player controllers
✓ AI behavior and event handlers
✓ UI callbacks and gameplay systems
✓ Rapid prototypes and iterative gameplay tuning

### With C++ (Engine/Optional)
✓ Low-level systems, performance-critical algorithms, and engine extensions

---

## 🔧 Migration Tips

1. Start new gameplay scripts in Lua.
2. Move non-performance logic from C++ scripts to Lua first.
3. Profile hot paths — if necessary, implement optimized C++ modules and expose bindings to Lua.

---

## ❓ FAQ

**Q: Do I need to install Lua to use the engine?**
A: No — Lua is optional for some setups, but recommended. See `LUA_INSTALLATION_GUIDE.md` for details.

**Q: Why is C++ scripting deprecated?**
A: Lua enables far faster iteration for gameplay, simpler distribution of script assets, and a more flexible development workflow. C++ remains for engine internals.

**Q: Can I still use existing C++ scripts?**
A: Existing C++ code can remain for engine-level features, but new gameplay scripts should be written in Lua. Consider migrating gameplay logic.

---

## ✅ Next Steps

1. Read `SCRIPTING_QUICK_START.md` (Lua method)
2. Create your first Lua script in `Scripts/`
3. Attach it in the editor and iterate rapidly

---

**Summary**: Use Lua as your primary scripting language. C++ is deprecated for gameplay scripts and should be reserved for engine internals and performance-critical modules.
