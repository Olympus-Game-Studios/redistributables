# Scripting Layer - Visual Guide & Reference

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Main Game Loop                             │
│                                                                 │
│  while (running) {                                              │
│    scriptEngine.AwakeScripts() ──┐                              │
│    scriptEngine.UpdateScripts()  ├─→ Script Lifecycle          │
│    Render()                      │   Execution                 │
│    scriptEngine.LateUpdateScripts()┘                            │
│  }                                                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
          ┌────────────▼──────────────┐
          │    ScriptEngine           │
          │ (Lifecycle Manager)       │
          └────────────┬──────────────┘
                       │
        ┌──────────────┼──────────────┬─────────────────┐
        │              │              │                 │
        ▼              ▼              ▼                 ▼
   ┌────────┐  ┌─────────────┐  ┌─────────┐    ┌───────────────┐
   │Registry│  │  Scene      │  │ Entities│    │ ScriptComponent
   │        │  │             │  │         │    │ (Multiple      │
   │Maps    │  │Contains--→  │--│ has --→ │───│ scripts)       │
   │script  │  │   Entities  │  │         │    │                │
   │names   │  └─────────────┘  └─────────┘    └───────────────┘
   │to      │                                        │
   │classes │                                        │
   └────────┘                                    ┌───▼──────────────┐
                                                 │  ScriptBase      │
                                                 │                  │
                                                 │  OnAwake()       │
                                                 │  OnUpdate(dt)    │
                                                 │  OnDestroy()     │
                                                 │  GetEntity()     │
                                                 │  GetScene()      │
                                                 └──────────────────┘
```

... (archived full content)
