RegisterCommand("gothere", function()
  SetEntityCoords(PlayerPedId(), 269.7664, -320.8406, 46.33287, true, false, false, false)
end, false)

RegisterNetEvent("streamables")
AddEventHandler("streamables", function(streamables)
  for i, streamable in ipairs(streamables) do
    RegisterStreamingFileFromCache(GetCurrentResourceName(), streamable.modelFileName, streamable.modelCacheKey);
    RegisterStreamingFileFromCache(GetCurrentResourceName(), streamable.textureFileName, streamable.textureCacheKey);
    print(GetCurrentResourceName(), streamable.modelFileName, streamable.modelCacheKey)
    print(GetCurrentResourceName(), streamable.textureFileName, streamable.textureCacheKey)
  end
end)

RegisterCommand("replace", function()
  RegisterArchetypes(function()
    return {
      {
        flags = 32,
        bbMin = vector3(-2.00000000, -0.00000030, -2.00000000),
        bbMax = vector3(2.00000000, 0.00000030, 2.000000),
        bsCentre = vector3(0.0, 0.0, 0.0),
        bsRadius = 2.82843000,
        name = 'mytestobject',
        textureDictionary = 'mytesttexture',
        physicsDictionary = '',
        assetName = 'mytestobject',
        assetType = 'ASSET_TYPE_DRAWABLE',
        lodDist = 60.0,
        specialAttribute = 0
      }
    }
  end)
  
  local hash = GetHashKey("mytestobject");
  RequestModel(hash);
  while not HasModelLoaded(hash) do
    Wait(100);
    print("waiting...")
  end

end, false)