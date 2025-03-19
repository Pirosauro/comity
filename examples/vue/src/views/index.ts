import type { Context } from 'hono';
import page from '~/components/pages/index.vue';

export default (ctx: Context) =>
  ctx.render(page, { title: 'Comity | Vue renderer example' });
