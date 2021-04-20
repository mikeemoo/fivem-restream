import toDDS from './to-dds';
import { setHttpCallback } from '@citizenfx/http-wrapper';
import Koa from 'koa';
import toYtd from './to-ytd';

const DEBUG_URL ='http://media.istockphoto.com/photos/seamless-texture-surface-of-the-moon-picture-id108604226';

const fetchAndConvert = async (url) => {
  const dds = await toDDS(url);
  return await toYtd(dds);
}

const app = new Koa();
app.use(async (ctx) => {
  const url = ctx.request.query.path || DEBUG_URL;
  
  ctx.set('Content-disposition', 'attachment; filename=myfile.dds');
  ctx.set('Content-type', 'image/vnd-ms.dds');
  ctx.body = await fetchAndConvert(url);
});

setHttpCallback(app.callback());

// debug
fetchAndConvert(DEBUG_URL);