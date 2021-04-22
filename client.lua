RegisterCommand("triggerCache", function(source, args, rawCommand)
  TriggerServerEvent("cacheRequest")
end, false)
RegisterNetEvent("cacheKey")
-- The event handler function follows after registering the event first.
AddEventHandler("cacheKey", function(cacheKey, cacheKey2)
  print(cacheKey)
  print(cacheKey2)
  RegisterStreamingFileFromCache(GetCurrentResourceName(), "testobjecttxd01.ytd", cacheKey)
  RegisterStreamingFileFromCache(GetCurrentResourceName(), "testobject01.ydr", cacheKey2)
  print("registered files")
  RegisterArchetypes(function()
      return {
          {
              flags = 32,
              bbMin = vector3(-39.99570000, -8.00155600, -2.56818800),
              bbMax = vector3(40.00439000, 7.99858000, 1.44575100),
              bsCentre = vector3(0.00434110, -0.00148870, -0.56121830),
              bsRadius = 40.84160000,
              name = 'testobject01',
              textureDictionary = 'testobjecttxd01',
              physicsDictionary = '',
              assetName = 'testobject01',
              assetType = 'ASSET_TYPE_DRAWABLE',
              lodDist = 450.45,
              specialAttribute = 0
          }
      }
  end)
  print("registered archetype");


  print("don")
  RequestModel(GetHashKey("testobject01"))
  print("requested model")
  print(IsModelInCdimage(GetHashKey("testobject01")))
  while not HasModelLoaded(GetHashKey("testobject01")) do
    Wait(1000)
    print("waiting")
  end
  Wait(10000);
  SetModelAsNoLongerNeeded(GetHashKey("testobject01"))
  print("done")
end)