local cacheKey = RegisterResourceAsset(GetCurrentResourceName(), "mytesttexture.ytd");
local cacheKey2 = RegisterResourceAsset(GetCurrentResourceName(), "mytestobject.ydr");
RegisterNetEvent("cacheRequest")
print("dds")
-- The event handler function follows after registering the event first.
AddEventHandler("cacheRequest", function()
    print("t")
    TriggerClientEvent("cacheKey", source, cacheKey, cacheKey2)
end)