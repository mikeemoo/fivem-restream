type PromiseTask = {
  res: (val: string) => void;
  rej: (err: Error) => void;
};

type TextureDefinition = {
  dictionary: string;
  texture: "texture"
};

const loaded: {
  [url: string]: Promise<string>
} = {};

const pending: {
  [url: string]: PromiseTask
} = {};

onNet("restream:texture", async (url: string, dictionary: string) => {
  console.log(url, dictionary);
  while (!HasStreamedTextureDictLoaded(dictionary)) {
    RequestStreamedTextureDict(dictionary, true);
    await new Promise((res) => setTimeout(res, 500));
  }
  pending[url].res(dictionary);
});

const getTexture = async (url: string): Promise<TextureDefinition>  => {
  if (!loaded[url]) {
    loaded[url] = new Promise<string>((res, rej) => {
      pending[url] = { res, rej };
      emitNet("restream:load", url);
    });
  }

  return {
    dictionary: await loaded[url],
    texture: "texture"
  }
};

const loadTexture = async (url: string, callback?: (definition: TextureDefinition) => void) => {
  const definition = await getTexture(url);
  if (callback) {
    callback(definition);
  }
  return definition;
}

global.exports("loadTexture", loadTexture);

// RegisterCommand("load-texture", async (_source: string, [url]: [string]) => {
//   coinst { dictionary, texture } = loadTexture(url);
//   RemoveReplaceTexture("testobjecttxd01", "testobjecttx01");
//   AddReplaceTexture("testobjecttxd01", "testobjecttx01", dictionary, texture);
// }, false);
