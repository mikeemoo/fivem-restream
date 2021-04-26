type PromiseTask = {
  res: (val: TextureDefinition) => void;
  rej: (err: Error) => void;
};

type TextureDefinition = {
  dictionary: string;
  texture: string;
};

const loaded: {
  [url: string]: Promise<TextureDefinition>
} = {};

const pending: {
  [url: string]: PromiseTask
} = {};

onNet("restream:texture", async (url: string, definition: TextureDefinition) => {
  while (!HasStreamedTextureDictLoaded(definition.dictionary)) {
    RequestStreamedTextureDict(definition.dictionary, true);
    await new Promise((res) => setTimeout(res, 500));
  }
  pending[url].res(definition);
});

const getTexture = async (url: string): Promise<TextureDefinition>  => {
  if (!loaded[url]) {
    loaded[url] = new Promise<TextureDefinition>((res, rej) => {
      pending[url] = { res, rej };
      emitNet("restream:load", url);
    });
  }
  return loaded[url];
};

const loadRemoteTexture = (url: string, callback?: (err: Error | null, definition?: TextureDefinition) => void) => {
  (async () => {
    try {
      const definition = await getTexture(url);
      if (callback) {
        callback(null, definition);
      }
    }catch (err) {
      callback(err);      
    }
  })();
}

global.exports("loadRemoteTexture", loadRemoteTexture);

// RegisterCommand("load-texture", async (_source: string, [url]: [string]) => {
//   coinst { dictionary, texture } = loadTexture(url);
//   RemoveReplaceTexture("testobjecttxd01", "testobjecttx01");
//   AddReplaceTexture("testobjecttxd01", "testobjecttx01", dictionary, texture);
// }, false);
