
local cacheKey = RegisterResourceAsset(GetCurrentResourceName(), "testobjecttxd02.ytd");
local cacheKey2 = RegisterResourceAsset(GetCurrentResourceName(), "testobject02.ydr");

RegisterNetEvent("cacheRequest")
print("dds")
-- The event handler function follows after registering the event first.
AddEventHandler("cacheRequest", function()
    print("t")
    TriggerClientEvent("cacheKey", source, cacheKey, cacheKey2)
end)