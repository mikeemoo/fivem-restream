local cacheKey = RegisterResourceAsset(GetCurrentResourceName(), "testobjecttxd01.ytd");
local cacheKey2 = RegisterResourceAsset(GetCurrentResourceName(), "testobject01.ydr");
RegisterNetEvent("cacheRequest")
print("dds")
-- The event handler function follows after registering the event first.
AddEventHandler("cacheRequest", function()
    print("t")
    TriggerClientEvent("cacheKey", source, cacheKey, cacheKey2)
end)