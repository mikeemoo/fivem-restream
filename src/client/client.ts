RegisterCommand("gothere", () => SetEntityCoords(PlayerPedId(), 269.7664, -320.8406, 46.33287, true, false, false, false), false);

type TextureDefinition = {
  dictionaryName: string,
  textureName: string
};

type Streamable = {
  textureDictionaryName: string;
  textureDictionaryCacheKey: string;
  textureDictionaryFileName: string;
  modelName: string;
  modelCacheKey: string;
  modelFileName: string;
};

const pending = {};
const textures = {};

onNet("restream:texture", (url: string, streamable: Streamable) => {
  console.log("got response", url, streamable);
  if (pending[url]) {
    pending[url].res(streamable);
    pending[url] = null;
    console.log("fired callback");
  }
});

const getTexture = async (url: string): Promise<TextureDefinition> => {

  if (!textures[url]) {
    emitNet("restream:getTexture", url);
    textures[url] = new Promise(async (resolve, reject) => {
      const streamable = await new Promise<Streamable>((res, rej) => {
        pending[url] = { res, rej };
      });
      console.log("about to register from cache...");
      RegisterStreamingFileFromCache(GetCurrentResourceName(), streamable.modelFileName, streamable.modelCacheKey);
      RegisterStreamingFileFromCache(GetCurrentResourceName(), streamable.textureDictionaryFileName, streamable.textureDictionaryCacheKey);

      RegisterArchetypes(() => [{
        flags: 32,
        bbMin: { x: -2.00000000, y: -0.00000030, z: -2.00000000 },
        bbMax: { x: 2.00000000, y: 0.00000030, z: 2.000000 },
        bsCentre: { x: 0.0, y: 0.0, z: 0.0 },
        bsRadius: 2.82843000,
        name: streamable.modelName,
        textureDictionary: streamable.textureDictionaryName,
        assetName: streamable.modelName,
        assetType: 'ASSET_TYPE_DRAWABLE',
        physicsDictionary: '',
        lodDist: 60.00000000,
        specialAttribute: 0
      }]);
      console.log("registered archetype...");

      const hash = GetHashKey(streamable.modelName);
      RequestModel(hash);
      console.log("requested model...");

      while (!HasModelLoaded(hash)) {
        await new Promise((res) => setTimeout(res, 50));
      }
      console.log("model is loaded...");

      console.log({
        dictionaryName: streamable.textureDictionaryName,
        textureName: "texture"
      });
      
      resolve({
        dictionaryName: streamable.textureDictionaryName,
        textureName: "texture"
      });
    });
  }

  return Promise.resolve(textures[url]);
};

global.exports("getTexture", (url: string, callback: (result: TextureDefinition) => void) => getTexture(url).then(callback));

(async () => {
  const texture = await getTexture("https://upload.wikimedia.org/wikipedia/commons/3/33/Tiling_procedural_textures.jpg");
  console.log(texture);
})();