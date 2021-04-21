RegisterCommand("triggerCache", function(source, args, rawCommand)
  TriggerServerEvent("cacheRequest")
end, false)
RegisterNetEvent("cacheKey")
-- The event handler function follows after registering the event first.
AddEventHandler("cacheKey", function(cacheKey, cacheKey2)
  print(cacheKey)
  print(cacheKey2)
  RegisterStreamingFileFromCache(GetCurrentResourceName(), "mytesttexture.ytd", cacheKey);
  RegisterStreamingFileFromCache(GetCurrentResourceName(), "mytestobject.ydr", cacheKey2);
  RegisterArchetypes(function()
      return {
          {
              flags = 32,
              bbMin = vector3(-39.99570000, -8.00155600, -2.56818800),
              bbMax = vector3(40.00439000, 7.99858000, 1.44575100),
              bsCentre = vector3(0.00434110, -0.00148870, -0.56121830),
              bsRadius = 40.84160000,
              name = 'mytestobject',
              textureDictionary = 'mytesttexture',
              physicsDictionary = '',
              assetName = 'mytestobject',
              assetType = 'ASSET_TYPE_DRAWABLE',
              lodDist = 450.45,
              specialAttribute = 0
          }
      }
  end)


  print("don")
  RequestModel(GetHashKey("mytestobject"))
  print(IsModelInCdimage(GetHashKey("mytestobject")))
  while not HasModelLoaded(GetHashKey("mytestobject")) do
    Wait(100)
  end
  SetModelAsNoLongerNeeded(GetHashKey("mytestobject"))
  print("done")
end)