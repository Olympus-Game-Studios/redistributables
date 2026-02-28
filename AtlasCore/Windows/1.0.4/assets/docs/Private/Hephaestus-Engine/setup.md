# Development Setup

This page explains how to get a working local development environment for Hephaestus Engine, how to build the engine, and how to run the tests locally.

Prerequisites (common)
- Git (>=2.30)
- CMake (>=3.20)
- Ninja (recommended) or Make
- A supported compiler:
  - Linux: GCC >=10 or Clang >=12
  - Windows: Visual Studio 2022 (MSVC toolset)
  - macOS: Xcode 13+ / clang
- Python 3.8+ (for scripts and test runners)
- Optional: Docker (for reproducible CI-like environments)
- Optional: vcpkg or your preferred package manager if the repo uses an external deps manager

Repository checkout
1. Clone the repo:
   git clone https://github.com/Olympus-Game-Studios/Hephaestus-Engine.git
   cd Hephaestus-Engine

2. Create a working branch for your feature:
   git checkout -b feat/short-description

Common build (out-of-tree)
1. Create a build directory:
   mkdir -p build && cd build

2. Configure with CMake (example for Ninja):
   cmake -G Ninja .. -DCMAKE_BUILD_TYPE=Debug

   Useful flags:
   -DCMAKE_BUILD_TYPE=Release
   -DHEPHAESTUS_ENABLE_SANITIZERS=ON
   -DHEPHAESTUS_USE_VCPKG=ON

3. Build:
   ninja

4. Run the editor / minimal sample:
   ./bin/hephaestus-editor   (or the platform binary name)

Platform-specific notes
- Windows (Visual Studio):
  - Use "x64 Native Tools Command Prompt" or run CMake from the VS generator.
  - Example:
    cmake -G "Visual Studio 17 2022" -A x64 .. -DHEPHAESTUS_USE_VCPKG=ON
- macOS:
  - Some dependencies may require Homebrew; install missing ones with brew.

Common issues and fixes
- Missing libs: ensure submodules and dependency manager are initialized:
  git submodule update --init --recursive
  (or) ./scripts/bootstrap_deps.py
- Compiler flags: use the project's tooling file (.clang-tidy, .clang-format) for consistent builds.

Development utilities
- Format code:
  clang-format -i <files>
  (project contains .clang-format at repo root)
- Run linters:
  ./scripts/run_linters.py
- Run unit tests:
  ./build/bin/test_runner --gtest_filter=*

Sanitizers and debugging
- To enable ASan/UBsan (if supported):
  cmake .. -DCMAKE_BUILD_TYPE=Debug -DHEPHAESTUS_ENABLE_SANITIZERS=ON
- To enable address/undefined behavior sanitizers on Linux, use Clang.
- For Windows, prefer Visual Studio's Address Sanitizer or use specialized tools.

If anything in these steps fails, open an issue using the "dev environment" tag and include:
- OS and version
- Compiler and version
- Exact CMake command used
- Build output and error messages