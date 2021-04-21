local streamables = {
  {
    modelFileName = "mytestobject.ydr",
    textureFileName = "mytesttexture.ytd",
    modelCacheKey = RegisterResourceAsset(GetCurrentResourceName(), "mytestobject.ydr"),
    textureCacheKey = RegisterResourceAsset(GetCurrentResourceName(), "mytesttexture.ytd")
  }  
}

RegisterNetEvent("playerJoining");
AddEventHandler("playerJoining", function(source)
  TriggerClientEvent("streamables", source, streamables)
end)