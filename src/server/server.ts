import { setHttpCallback } from '@citizenfx/http-wrapper';
import Koa from 'koa';
import toYtd from './to-ytd';

const streamables = [
  {
    modelFileName: "mytestobject.ydr",
    textureFileName: "mytesttexture.ytd",
    modelCacheKey: null,
    textureCacheKey: null
  }  
]

streamables.forEach((streamable) => {
  streamable.modelCacheKey = RegisterResourceAsset(GetCurrentResourceName(), streamable.modelFileName);
  streamable.textureCacheKey = RegisterResourceAsset(GetCurrentResourceName(), streamable.textureFileName);
});

onNet("playerJoining", (source: string) => emitNet("streamables", source, streamables));

//const DEBUG_URL ='http://media.istockphoto.com/photos/seamless-texture-surface-of-the-moon-picture-id108604226';
const DEBUG_URL = 'https://images-eu.ssl-images-amazon.com/images/I/91-kPSv2efL.png';

const app = new Koa();
app.use(async (ctx) => {
  const url = (ctx.request.query.url as string) || DEBUG_URL;
  const dictionaryName = (ctx.request.query.dictionaryName as string) || "txdictionary";

  ctx.set('Content-disposition', `attachment; filename=${dictionaryName}.ytd`);
  ctx.set('Content-type', 'application/x-binary');
  ctx.body = await toYtd(url);
});

setHttpCallback(app.callback());
