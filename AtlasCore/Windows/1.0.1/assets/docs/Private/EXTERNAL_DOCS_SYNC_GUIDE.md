# Managing External Library Documentation

This guide explains how to sync and manage external library documentation in this repository.

## Overview

We use a **documentation sync approach** rather than Git submodules. This means:
- Only documentation files are copied into our repo (not entire source code)
- Smaller repository size and faster clones
- Documentation is versioned directly in our repo
- Manual sync when needed (typically when updating library versions)

## Initial Setup

Documentation is already included when you clone the repository - no additional setup needed!

```bash
git clone https://github.com/Olympus-Game-Studios/documentation.git
cd documentation
# Documentation is ready to read in Hephaestus-Engine/ExternalLibraries/
```

## Syncing Documentation

To update documentation from all external libraries to their latest versions:

```powershell
# From the repository root
.\sync-external-docs.ps1
```

This script will:
1. Clone each library with sparse checkout (documentation only)
2. Copy README files and docs directories
3. Create `_SYNC_INFO.md` files with commit hash and sync date
4. Clean up temporary files

After the sync completes:

```powershell
# Review what changed
git status
git diff

# Commit the updates
git add Hephaestus-Engine/ExternalLibraries/
git commit -m "Update external library documentation"
git push
```

## Adding a New External Library

To add documentation for a new library:

1. **Edit the sync script** (`sync-external-docs.ps1`) and add a new entry to the `$libraries` array:

```powershell
@{
    name = "new-library"
    url = "https://github.com/owner/new-library.git"
    docFiles = @("README.md", "docs/*", "*.md")
    path = "Hephaestus-Engine/ExternalLibraries/new-library"
}
```

2. **Update EXTERNAL_LIBS_README.md** to include the new library in the list

3. **Run the sync script:**
   ```powershell
   .\sync-external-docs.ps1
   ```

4. **Commit the changes:**
   ```powershell
   git add .
   git commit -m "Add new-library documentation"
   git push
   ```

## Syncing with Hephaestus Engine Versions

To ensure documentation matches the library versions used in the Hephaestus Engine:

### Option 1: Sync to Specific Commits (Recommended)

Edit the sync script to checkout specific commits that match the engine:

```powershell
# In sync-external-docs.ps1, after cloning:
Push-Location $libTempPath
git checkout <commit-hash-from-engine>  # Add this line
# ... rest of the script
Pop-Location
```

### Option 2: Manual Selective Sync

1. **Check the Engine's library versions:**
   ```bash
   # In the Hephaestus-Engine repository
   cd extern
   git submodule status
   ```

2. **Manually clone and copy docs for a specific version:**
   ```powershell
   $tempPath = Join-Path $env:TEMP "imgui-temp"
   git clone https://github.com/ocornut/imgui.git $tempPath
   cd $tempPath
   git checkout <commit-hash-from-engine>
   
   # Copy documentation
   Copy-Item README.md "z:\Olympus Studios\documentation\Hephaestus-Engine\ExternalLibraries\imgui\"
   Copy-Item -Recurse docs\* "z:\Olympus Studios\documentation\Hephaestus-Engine\ExternalLibraries\imgui\docs\"
   
   # Clean up
   cd ..
   Remove-Item -Recurse -Force $tempPath
   ```

## Troubleshooting

### Script fails with "git: command not found"

Ensure Git is installed and in your PATH:
```powershell
git --version
```

### Documentation folder is empty after sync

Check the script output for errors. The library may have docs in a different location. Update the `docFiles` array in the script.

### Want to sync only one library

Edit the `$libraries` array in the script to comment out libraries you don't want to sync:

```powershell
$libraries = @(
    @{
        name = "imgui"
        url = "https://github.com/ocornut/imgui.git"
        docFiles = @("README.md", "docs/*")
        path = "Hephaestus-Engine/ExternalLibraries/imgui"
    }
    # Other libraries commented out...
)
```

### Removing a library's documentation

Simply delete the library's folder and update the EXTERNAL_LIBS_README.md:

```powershell
Remove-Item -Recurse "Hephaestus-Engine\ExternalLibraries\old-library"
git add -A
git commit -m "Remove old-library documentation"
```

## Best Practices

1. **Sync when updating libraries:** Run the sync script whenever the Hephaestus Engine updates its external library versions
2. **Review before committing:** Always review the changes with `git diff` before committing documentation updates
3. **Check sync info:** Look at the `_SYNC_INFO.md` files in each library folder to see which commit the docs are from
4. **Pin to stable versions:** Modify the script to checkout specific tags/releases rather than latest commits for stability
5. **Keep script updated:** When adding new libraries to the engine, update the sync script

## Automated Sync with GitHub Actions

You can create a GitHub Action to automatically check for and sync documentation updates:

```yaml
# .github/workflows/sync-external-docs.yml
name: Sync External Library Documentation

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:  # Manual trigger

jobs:
  sync-docs:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run sync script
        run: .\sync-external-docs.ps1
        shell: powershell
      
      - name: Check for changes
        id: changes
        run: |
          git diff --quiet || echo "changed=true" >> $GITHUB_OUTPUT
      
      - name: Commit and push if changed
        if: steps.changes.outputs.changed == 'true'
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add Hephaestus-Engine/ExternalLibraries/
          git commit -m "Auto-sync external library documentation"
          git push
```

## For External Library Maintainers

If you maintain one of the external libraries and update documentation:

1. **Update docs in your repository** as normal
2. **Tag releases** with semantic versioning
3. **Notify the Hephaestus Engine team** when documentation changes significantly
4. The engine team will update the submodule reference when they upgrade your library

The documentation in this repo will automatically reflect your changes once the submodule is updated.
