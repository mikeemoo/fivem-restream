RegisterCommand("gothere", () => SetEntityCoords(PlayerPedId(), 269.7664, -320.8406, 46.33287, true, false, false, false), false);


emitNet("getCacheKey");
onNet("cacheKey", async (filename: string, cacheKey: string) => {
  RegisterStreamingFileFromCache(GetCurrentResourceName(), filename, cacheKey);
});

RegisterCommand("replace", () => {
  AddReplaceTexture("testobjecttxd01", "testobjecttx01", "test", "texture")
}, false);
