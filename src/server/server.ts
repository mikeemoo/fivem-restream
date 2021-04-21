import toDDS from './to-dds';
import { setHttpCallback } from '@citizenfx/http-wrapper';
import Koa from 'koa';
import toYtd from './to-ytd';

//const DEBUG_URL ='http://media.istockphoto.com/photos/seamless-texture-surface-of-the-moon-picture-id108604226';
const DEBUG_URL = 'https://images-eu.ssl-images-amazon.com/images/I/91-kPSv2efL.png';

const fetchAndConvert = async (url) => {
  const { width, height, stride, data } = await toDDS(url);
  return await toYtd(width, height, stride, data);
}

const app = new Koa();
app.use(async (ctx) => {
  const url = ctx.request.query.path || DEBUG_URL;

  ctx.set('Content-disposition', 'attachment; filename=myfile2.dds');
  ctx.set('Content-type', 'image/vnd-ms.dds');
  ctx.body = await fetchAndConvert(url);
});

setHttpCallback(app.callback());

// debug
fetchAndConvert(DEBUG_URL);
