import createYtd from "./create-ytd";
import path from "path";
import fs from "fs";
import crypto from "crypto";

type TextureDefinition = {
  dictionary: string;
  texture: "texture"
};

const resourcePath = GetResourcePath("texture-loader");

const textures: { [url: string]: Promise<TextureDefinition> } = {};

const loadTexture = async (url: string) => {
  if (!textures[url]) {
    textures[url] = new Promise(async (res) => {

      const urlHash = crypto.createHash("sha1").update(url).digest("hex").substr(0, 7);
      const dictionary = `genTdx${urlHash}`;
      const dictionaryPath = path.join(resourcePath, `stream/${dictionary}.ytd`);
    
      if (!fs.existsSync(dictionaryPath)) {
        const ytdBuffer = await createYtd(url);
        await new Promise((res) => fs.writeFile(dictionaryPath, ytdBuffer, () => res(null)));
        StopResource("texture-loader");
        StartResource("texture-loader");
      }

      res({
        dictionary,
        texture: "texture"
      });
    });
  }

  return textures[url];
}

onNet("restream:load", async (url: string) => {
  const _source = source;
  emitNet("restream:texture", _source, url, await loadTexture(url));
});

global.exports("loadRemoteTexture", (url: string, callback?: (err: Error | null, definition?: TextureDefinition) => void) => {
  (async () => {
    try {
      const definition = await loadTexture(url);
      if (callback) {
        callback(null, definition);
      }
    } catch (e) {
      if (callback) {
        callback(e);
      }
    }
  })();
});