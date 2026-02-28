-- EnableDisable.lua
-- Test: Validates the exact lifecycle callback ordering.
-- Expected output on Play:
--   [EnableDisable] onAwake        (once)
--   [EnableDisable] onEnable       (once)
-- Expected output on Stop:
--   [EnableDisable] onDisable      (once)
--   [EnableDisable] onDestroy      (once)
-- No duplicates across multiple Play/Stop cycles.

function onAwake()
    engine_log("[EnableDisable] onAwake")
end

function onEnable()
    engine_log("[EnableDisable] onEnable")
end

function onUpdate(dt)
    -- intentionally empty for this test
end

function onLateUpdate(dt)
    -- intentionally empty for this test
end

function onDisable()
    engine_log("[EnableDisable] onDisable")
end

function onDestroy()
    engine_log("[EnableDisable] onDestroy")
end
