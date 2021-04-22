import createYtd from "./create-ytd";
import createYdr from "./create-ydr";
import path from "path";
import fs from "fs";

type Streamable = {
  textureDictionaryName: string;
  textureDictionaryCacheKey: string;
  textureDictionaryFileName: string;
  modelName: string;
  modelCacheKey: string;
  modelFileName: string;
};

let nameIndex = 0;
const resourcePath = GetResourcePath(GetCurrentResourceName());
const streamables: { [url: string] : Promise<Streamable> } = {};

const getTexture = async (url: string): Promise<Streamable> => {

  console.log("getting texture for ", url);

  // if (true === true) {
  //   const tdCK = RegisterResourceAsset(GetCurrentResourceName(), "testobjecttxd01.ytd");
  //   const mCK = RegisterResourceAsset(GetCurrentResourceName(), "testobject01.ydr");
  
  //   return {
  //     textureDictionaryName: "testobjecttxd01",
  //     textureDictionaryCacheKey: tdCK,
  //     textureDictionaryFileName: "testobjecttxd01.ytd",
  //     modelName: "testobject01",
  //     modelCacheKey: mCK,
  //     modelFileName: "testobject01.ydr"
  //   };
  // }

  const indexStr = String(nameIndex++);

  const textureDictionaryName = `genTdx${indexStr}`;
  const modelName = `genObj${indexStr}`;

  const textureDictionaryFileName = `cache/${textureDictionaryName}.ytd`;
  const modelFileName = `cache/${modelName}.ydr`;

  const ytdPath = path.join(resourcePath, textureDictionaryFileName);
  const ydrPath = path.join(resourcePath, modelFileName);

  const ytdBuffer = await createYtd(url);
  const ydrBuffer = await createYdr(modelName);

  await Promise.all([
    new Promise((res) => fs.unlink(ytdPath, () => res(null))),
    new Promise((res) => fs.unlink(ydrPath, () => res(null))),
  ]);

  await Promise.all([
    new Promise((res) => fs.writeFile(ytdPath, ytdBuffer, () => res(null))),
    new Promise((res) => fs.writeFile(ydrPath, ydrBuffer, () => res(null))),
  ]);

  const textureDictionaryCacheKey = RegisterResourceAsset(GetCurrentResourceName(), textureDictionaryFileName);
  const modelCacheKey = RegisterResourceAsset(GetCurrentResourceName(), modelFileName);

  return {
    textureDictionaryName,
    textureDictionaryCacheKey,
    textureDictionaryFileName,
    modelName,
    modelCacheKey,
    modelFileName
  };
}

onNet("restream:getTexture", async (url: string) => {
  console.log("restream:getTexture", url);
  if (!streamables[url]) {
    streamables[url] = getTexture(url);
  }
  return Promise.resolve(streamables[url]).then((streamable) => {
    emitNet("restream:texture", source, url, streamable);
  });
});

global.exports("createTexture", (url: string) => {
  if (!streamables[url]) {
    streamables[url] = getTexture(url);
  }
});