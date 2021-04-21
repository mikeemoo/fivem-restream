RegisterCommand("gothere", () => SetEntityCoords(PlayerPedId(), 269.7664, -320.8406, 46.33287, true, false, false, false), false);

RegisterCommand("requestCacheKey", async () => {
  emitNet("getCacheKey");
  onNet("cacheKey", async (filename: string, cacheKey: string) => {
    RegisterStreamingFileFromCache(GetCurrentResourceName(), filename, cacheKey);
    console.log(filename);
  });
}, false);

RegisterCommand("replace", async () => {
  RegisterArchetypes(() => [{
		flags: 32,
		bbMin: [-2.00000000, -0.00000030, -2.00000000],
		bbMax: [2.00000000, 0.00000030, 2.000000],
		bsCentre: [0.0, 0.0, 0.0],
		bsRadius: 2.82843000,
		name: 'test_model',
		textureDictionary: 'test2',
		assetName: 'test_model',
		assetType: 'ASSET_TYPE_DRAWABLE',
		lodDist: 60.00000000,
		specialAttribute: 0
  }]);

  const hash = GetHashKey("test_model");
  RequestModel(hash);
  while (!HasModelLoaded(hash)) {
    await new Promise((res) => setTimeout(res, 100));
    console.log('waiting');
  }

}, false)