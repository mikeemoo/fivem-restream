RegisterCommand("gothere", () => SetEntityCoords(PlayerPedId(), 269.7664, -320.8406, 46.33287, true, false, false, false), false);

onNet("streamables", (streamables) => {
  streamables.forEach((streamable) => {
    RegisterStreamingFileFromCache(GetCurrentResourceName(), streamable.modelFileName, streamable.modelCacheKey);
    RegisterStreamingFileFromCache(GetCurrentResourceName(), streamable.textureFileName, streamable.textureCacheKey);
  })
});

RegisterCommand("replace", async () => {
  RegisterArchetypes(() => [{
		flags: 32,
		bbMin: [-2.00000000, -0.00000030, -2.00000000],
		bbMax: [2.00000000, 0.00000030, 2.000000],
		bsCentre: [0.0, 0.0, 0.0],
		bsRadius: 2.82843000,
		name: 'mytestobject',
		textureDictionary: 'mytesttexture',
		assetName: 'mytestobject',
		assetType: 'ASSET_TYPE_DRAWABLE',
    physicsDictionary: '',
		lodDist: 60.00000000,
		specialAttribute: 0
  }]);

  const hash = GetHashKey("mytestobject");
  RequestModel(hash);
  while (!HasModelLoaded(hash)) {
    await new Promise((res) => setTimeout(res, 1000));
    console.log('waiting');
  }

}, false)