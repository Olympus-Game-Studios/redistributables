````markdown
# Project Manager - UI Mockup & Features

## 🎨 Visual Design

### Color Scheme
```
Primary Colors:
- Accent Blue:    #4398FA (rgb: 67, 152, 250)
- Success Green:  #52CC99 (rgb: 82, 204, 153)
- Warning Yellow: #E6B34D (rgb: 230, 179, 77)
- Error Red:      #E65C5C (rgb: 230, 92, 92)

Background Colors:
- Sidebar:        #242933 (rgb: 36, 41, 51)
- Card BG:        #2E3340 (rgb: 46, 51, 64)
- Card Hover:     #383D4A (rgb: 56, 61, 74)
- Header:         #1F2229 (rgb: 31, 34, 41)
```

### Typography
```
Header Title: Large, bold, accent color
Section Titles: Medium, uppercase, accent color
Body Text: Regular, light gray
Metadata: Small, dimmed gray
```

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER (60px height)                                                │
│ ┌─────────────────────────────────────────────────────────────┐    │
│ │ 🔥 HEPHAESTUS ENGINE  Project Manager     [+ New Project]   │    │
│ └─────────────────────────────────────────────────────────────┘    │
├──────────────┬──────────────────────────────────────────────────────┤
│ SIDEBAR      │ TOOLBAR                                              │
│ (250px)      │ ┌────────────────────────────────────────────────┐  │
│              │ │ [Search] [Sort ▼] [Grid][List]                 │  │
│ QUICK ACCESS │ └────────────────────────────────────────────────┘  │
│ ────────     ├──────────────────────────────────────────────────────┤
│ • Recent     │ PROJECT GRID/LIST VIEW                               │
│ • Favorites  │                                                      │
│ • All        │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│              │ │ [IMG]  │ │ [IMG]  │ │ [IMG]  │ │ [IMG]  │        │
│ ────────     │ │        │ │        │ │        │ │        │        │
│              │ │ RPG    │ │ Shooter│ │ Puzzle │ │ Racer  │        │
│ ACTIONS      │ │ Game ⭐│ │ Demo   │ │ Game ⭐│ │ Proto  │        │
│ ────────     │ │ 2024   │ │ 2024   │ │ 2024   │ │ 2023   │        │
│ • Import     │ └────────┘ └────────┘ └────────┘ └────────┘        │
│ • Open Fldr  │                                                      │
│ • Refresh    │ ┌────────┐ ┌────────┐ ┌────────┐                   │
│              │ │ [IMG]  │ │ [IMG]  │ │ [IMG]  │                   │
│ ────────     │ │        │ │        │ │        │                   │
│              │ │ Space  │ │ Test   │ │ Sample │                   │
│ Total: 12    │ │ Sim    │ │ Scene  │ │ Assets │                   │
│              │ │ 2024   │ │ 2024   │ │ 2023   │                   │
│              │ └────────┘ └────────┘ └────────┘                   │
│              │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

## 🎯 Component Breakdown

### 1. Header Bar
```
┌──────────────────────────────────────────────────────┐
│ 🔥 HEPHAESTUS ENGINE  Project Manager                │
│                                     [+ New Project]  │
└──────────────────────────────────────────────────────┘

Features:
• Engine branding with icon
• "Project Manager" subtitle
• Prominent "New Project" button (blue, 140x30px)
• Clean, professional appearance
```

### 2. Sidebar
```
┌──────────────┐
│ QUICK ACCESS │ ← Section header (blue)
│ ────────     │
│ • Recent     │ ← Selectable items
│ • Favorites  │   (highlight on hover/select)
│ • All        │
│              │
│ ────────     │
│ ACTIONS      │ ← Section header
│ ────────     │
│ • Import...  │ ← Action items
│ • Open Fldr  │
│ • Refresh    │
│              │
│ ────────     │
│ Total: 12    │ ← Status info
└──────────────┘

Features:
• Fixed width: 250px
• Dark background: #242933
• Organized sections
• Clear visual hierarchy
```

### 3. Toolbar
```
┌────────────────────────────────────────────────────┐
│ [🔍 Search projects...] [Sort ▼] [Grid] [List]    │
└────────────────────────────────────────────────────┘

Components:
• Search box (300px wide)
  - Placeholder text: "Search projects..."
  - Real-time filtering
  
• Sort dropdown (150px wide)
  - Last Modified
  - Name
  - Created
  - Favorites
  
• View toggle buttons
  - Grid (active: blue, inactive: gray)
  - List (same styling)
  
• Status messages (right side)
  - Success (green): "Project created!"
  - Error (red): "Failed to..."
  - Auto-hide after 3 seconds
```

### 4. Grid View Cards
```
┌────────────────┐
│ [  Thumbnail  ]│ ← 164x104px thumbnail area
│ [    Image    ]│   (180px card - 16px padding)
│                │
│ ⭐              │ ← Favorite star (if favorited)
│                │
│ Project Name   │ ← Bold, 14px
│ 2024-11-07     │ ← Date, dimmed, 12px
└────────────────┘

Card Specifications:
• Size: 180x260px (thumbnail + text area)
• Padding: 8px
• Border radius: 4px
• Background: #2E3340
• Hover: #383D4A
• Selected: #4398FA (border or highlight)

Hover Effects:
• Background lightens
• Cursor: pointer
• Subtle scale (optional)

Click Behavior:
• Single click: Select
• Double click: Open project
• Right click: Context menu
```

### 5. List View Items
```
┌────────────────────────────────────────────────────┐
│ ⭐ RPG Game                    2024-11-07 14:30    │ ← 32px height
├────────────────────────────────────────────────────┤
│    Shooter Demo                2024-11-05 09:15    │
├────────────────────────────────────────────────────┤
│ ⭐ Puzzle Game                 2024-10-28 16:45    │
└────────────────────────────────────────────────────┘

Features:
• Compact 32px height per item
• Favorite star (left, if applicable)
• Project name (left-aligned)
• Date (right-aligned)
• Alternating row colors (subtle)
• Hover highlight
```

### 6. Context Menu
```
┌────────────────────┐
│ Open               │ ← Primary action
├────────────────────┤
│ Add to Favorites   │ ← Toggle favorite
├────────────────────┤
│ Open Folder        │ ← OS integration
│ Edit Details...    │ ← Future feature
├────────────────────┤
│ Delete Project...  │ ← Danger (red text)
└────────────────────┘

Styling:
• Standard ImGui popup
• Red text for destructive actions
• Separator between action groups
```

---

## 🎬 Interaction Flows

### Flow 1: Creating a New Project

```
Step 1: Click "New Project" button
        ↓
┌─────────────────────────────────────┐
│ Create New Project            [✕]  │
├─────────────────────────────────────┤
│ Project Name:                       │
│ [My Awesome Game____________]       │
│                                     │
│ Description:                        │
│ ┌─────────────────────────────────┐│
│ │A fun action RPG...              ││
│ │                                 ││
│ └─────────────────────────────────┘│
│                                     │
│ Choose a Template:                  │
│ ┌─────────────────────────────────┐│
│ │ ● Empty Project                 ││
│ │   Start with a blank project    ││
│ │                                 ││
│ │ ○ 3D Project                    ││
│ │   Template for 3D games...      ││
│ │                                 ││
│ │ ○ 2D Project                    ││
│ │   Template for 2D games...      ││
│ └─────────────────────────────────┘│
│                                     │
│     [Create Project]  [Cancel]     │
└────────────────────────────────────┘

Step 2: Fill in details
Step 3: Select template (optional)
Step 4: Click "Create Project"
        ↓
Project created with folder structure:
MyAwesomeGame/
├── .hephaestus/
│   └── project.meta
├── assets/
│   ├── models/
│   ├── textures/
│   ├── materials/
│   ├── scenes/
│   └── ...
└── (template files if selected)
```

### Flow 2: Opening a Project

```
Method A: Recent Projects
1. Click "Recent" in sidebar
2. See last 5 projects
3. Double-click to open

Method B: Search
1. Type project name in search
2. Project filters in real-time
3. Double-click to open

Method C: Browse Grid
1. Scroll through visual grid
2. See thumbnails and names
3. Double-click to open

Method D: Context Menu
1. Right-click project
2. Select "Open"
```

### Flow 3: Managing Favorites

```
Add to Favorites:
1. Right-click project
2. Select "Add to Favorites"
3. ⭐ appears on card
4. Project moves to top when sorted by Favorites

Remove from Favorites:
1. Right-click favorited project
2. Select "Remove from Favorites"
3. ⭐ disappears
```

---

## 📱 Responsive Behavior

### Window Sizes

**Large Window (1920x1080+)**
```
• Grid: 6-8 columns
• Thumbnail size: 180px
• Sidebar: 250px
• Comfortable spacing
```

**Medium Window (1280x720)**
```
• Grid: 4-5 columns
• Thumbnail size: 180px (same)
• Sidebar: 250px (same)
• Adjusted margins
```

**Small Window (1024x600)**
```
• Grid: 3-4 columns
• Thumbnail size: 150px (scaled down)
• Sidebar: 200px (narrower)
• Compact spacing
```

---

## 🎨 Visual States

### Project Card States

**Default:**
- Background: #2E3340
- Border: none
- Opacity: 100%

**Hover:**
- Background: #383D4A (lighter)
- Border: none
- Cursor: pointer
- Smooth transition (0.2s)

**Selected:**
- Background: #383D4A
- Border: 2px solid #4398FA
- Highlight effect

**Favorite:**
- ⭐ icon in top-right
- Yellow/gold color (#FFC800)

---

## 🔤 Font Usage

```
Header Title:
• Font: Default ImGui font (scaled 1.2x)
• Color: #4398FA (accent blue)
• Weight: Bold

Section Headers:
• Font: Default
• Color: #4398FA
• Transform: UPPERCASE
• Size: Default

Project Names:
• Font: Default
• Color: #FFFFFF (white)
• Weight: Semi-bold

Metadata/Dates:
• Font: Default
• Color: #808080 (dimmed)
• Size: 0.9x default

Body Text:
• Font: Default
• Color: #C0C0C0 (light gray)
```

---

## ⚡ Performance Optimizations

### Rendering
- Only render visible cards (virtual scrolling)
- Lazy-load thumbnails
- Cache texture references
- Reuse draw calls

### Data Management
- Filter/sort only on change
- Cache filtered results
- Async metadata loading
- Debounce search input

---

## 🎯 Accessibility

### Keyboard Navigation
- Tab: Navigate between sections
- Arrow Keys: Navigate grid/list
- Enter: Open selected project
- Delete: Delete selected (with confirm)
- F2: Rename selected
- Ctrl+F: Focus search

### Visual Indicators
- Clear hover states
- Selection highlight
- Focus rings
- High contrast text
- Large click targets (min 32px)

---

## 🌟 Polish Details

### Animations
- Fade in/out for messages (0.3s)
- Smooth color transitions (0.2s)
- Card hover scale (subtle, 1.02x)
- Search results animate in

### Feedback
- Hover tooltip on truncated names
- Loading spinner for long operations
- Success/error toast messages
- Confirmation dialogs for destructive actions

### Error Handling
- Graceful degradation (missing thumbnails)
- Clear error messages
- Retry options
- Fallback to defaults

---

This UI design provides a modern, professional experience that rivals commercial game engines while remaining true to Hephaestus Engine's identity! 🎮✨

````