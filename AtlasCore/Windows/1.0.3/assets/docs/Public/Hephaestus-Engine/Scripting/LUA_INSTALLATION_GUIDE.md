# Lua Installation Guide

This guide explains how to install Lua to enable Lua scripting support in Hephaestus Engine. While the engine builds and runs without Lua, installing it unlocks the Lua scripting system for faster iteration without C++ recompilation.

## Why Lua?

Lua is used in many AAA games (Roblox, Genshin Impact, World of Warcraft, etc.) because it offers:
- **Fast iteration**: Edit scripts without recompiling C++
- **Small footprint**: ~300KB embedded binary
- **Easy integration**: Direct C API or wrapper libraries
- **Performance**: Efficient bytecode compilation

The Hephaestus Engine uses a **hybrid approach**:
- **Legacy C++ scripts (deprecated)**: For performance-critical code
- **Lua scripts**: For game logic, prototyping, and rapid iteration

Both can run on the same entity simultaneously.

## Current Build Status

The Hephaestus Engine currently builds **without** Lua installed. You'll see this message on startup:

```
Lua not available - scripting disabled. Install Lua to enable.
```

This is **not an error**—legacy C++ scripts may still be present but C++ scripting is deprecated. Installing Lua is recommended and is the supported scripting workflow.

## Installation by Platform

### Windows (Recommended: vcpkg)

[vcpkg](https://github.com/Microsoft/vcpkg) is the easiest way to install Lua on Windows:

```powershell
# Install vcpkg if you don't have it
git clone https://github.com/Microsoft/vcpkg
cd vcpkg
.\vcpkg integrate install

# Install Lua
.\vcpkg install lua:x64-windows
```

Then rebuild the project. CMake will automatically detect Lua and enable it.

**Alternative: Windows (System Install)**

Download and install from [Lua.org](https://www.lua.org/download.html):
1. Download Lua source or pre-built binaries
2. Extract to a known location (e.g., `C:\Lua`)
3. Add to PATH or configure CMake with `-DLUA_INCLUDE_DIR=C:\Lua\include -DLUA_LIBRARIES=C:\Lua\lua53.lib`

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install liblua5.3-dev
```

Then rebuild:
```bash
cd build
cmake ..
cmake --build . --config Release
```

### Linux (Fedora/CentOS/RHEL)

```bash
sudo dnf install lua-devel
```

### macOS

Using Homebrew:
```bash
brew install lua
```

Or using MacPorts:
```bash
sudo port install lua +universal
```

Then rebuild the project.

### Manual Build (Any Platform)

If package managers don't work:

1. Download Lua source: https://www.lua.org/download.html
2. Extract to your system or `engine/extern/lua/`
3. Build and install:
   ```bash
   cd lua-5.4.x
   make
   sudo make install
   ```

## Verifying Installation

After installing Lua, rebuild the project:

```powershell
# Windows
cd build
cmake ..
cmake --build . --config Release
```

```bash
# Linux/macOS
cd build
cmake ..
cmake --build . --config Release
```

On startup, you should see:

```
Lua scripting engine initialized
Registering Lua bindings...
  - Entity bindings registered
  - Transform bindings registered
  - Input bindings registered
  - Utility bindings registered
Lua bindings registered
```

If it still says "Lua not available", CMake could not find Lua. Check:
1. Installation location matches CMake search paths
2. Run `cmake --trace-expand` for detailed CMake output
3. Manually set `LUA_INCLUDE_DIR` and `LUA_LIBRARIES` in CMakeLists.txt

## Using Lua After Installation

Once Lua is installed, you can:

1. **Create Lua scripts** in `engine/Game/scripts/` or via asset browser
2. **Attach scripts** to entities using the Details Panel
3. **Use Lua bindings** for Entity, Transform, Input, and Utility functions
4. **See real-time changes** without C++ recompilation

Example Lua script (`myscript.lua`):
```lua
function onAwake()
    print("[Lua] Script awakened")
    local pos = Transform.getPosition()
    print("[Lua] Position: " .. pos.x .. ", " .. pos.y .. ", " .. pos.z)
end

function onUpdate(deltaTime)
    if Input.isKeyPressed("W") then
        print("[Lua] W key pressed")
    end
end

function onDestroy()
    print("[Lua] Script destroyed")
end
```

Attach via Details Panel:
1. Select entity in scene
2. Scroll to "Lua Scripts" section
3. Click "Attach Script" or paste script path
4. Press Enter to attach

## Troubleshooting

**Build still says "Could NOT find Lua"**
- Verify Lua is installed: `lua -v` (Windows/Linux/macOS)
- Check package was installed correctly
- Try reinstalling with package manager

**CMake can't find LUA_LIBRARIES**
- On Linux, you may need `lua5.3-dev` not just `lua`
- Ensure cmake cache is cleared: `rm -rf build && mkdir build && cd build && cmake ..`

**Lua scripts don't attach**
- Ensure Lua is installed and enabled (see startup message)
- Check script file path is correct
- Look for errors in console output

**Performance issues with Lua**
- Move performance-critical code to C++
- Use `local` for variables (faster than globals)
- Lua is still very fast—most games use Lua for non-critical logic

## Next Steps

- Read [LUA_SCRIPTING_GUIDE.md](LUA_SCRIPTING_GUIDE.md) for scripting documentation
- See [SCRIPT_DEVELOPMENT_GUIDE.md](SCRIPT_DEVELOPMENT_GUIDE.md) for legacy C++ scripts (deprecated)
- Check `engine/Game/scripts/example.lua` for example Lua script

## Additional Resources

- Lua Manual: https://www.lua.org/manual/
- Lua Learning: https://www.lua.org/pil/
- Game Engine Lua Integration: https://www.lua.org/gems/
