import toDDS from './to-dds';
import { setHttpCallback } from '@citizenfx/http-wrapper';
import Koa from 'koa';
import toYtd from './to-ytd';

const app = new Koa();
app.use(async (ctx) => {
  const url = ctx.request.query.path || 'http://media.istockphoto.com/photos/seamless-texture-surface-of-the-moon-picture-id108604226'
  
  ctx.set('Content-disposition', 'attachment; filename=myfile.dds');
  ctx.set('Content-type', 'image/vnd-ms.dds');

  const dds = await toDDS(url);;
  ctx.body = await toYtd(dds);
});

setHttpCallback(app.callback())