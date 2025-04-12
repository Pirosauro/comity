import type { Context } from 'hono';
import { Suspense } from 'preact/compat';
import { Counter } from '~/components/counter.js?island=Counter';
import { User } from '~/components/user.js?island=User';

export default async (ctx: Context) =>
  ctx.render(
    <div>
      <div style={{ backgroundColor: 'aquamarine', padding: '20px' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <User $client:load />
        </Suspense>
      </div>
      <div style={{ padding: '30px 5px 5px' }}>
        This island is hydrated on <b>load</b>
      </div>
      <div style={{ backgroundColor: 'aliceblue', padding: '20px' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Counter $client:load count={10} />
        </Suspense>
      </div>
      <div style={{ padding: '30px 5px 5px' }}>
        This island is hydrated on <b>idle</b>
      </div>
      <div style={{ backgroundColor: 'wheat', padding: '20px' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Counter $client:idle count={20} />
        </Suspense>
      </div>
      <div style={{ padding: '30px 5px 5px' }}>
        This island is hydrated on <b>screen size &lt;= 600px</b>. Resize the
        screen to hydrate
      </div>
      <div style={{ backgroundColor: 'gold', padding: '20px' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Counter $client:media="(max-width: 600px)" count={30} />
        </Suspense>
      </div>
      <div style={{ padding: '30px 5px 5px', lineHeight: '1.5em' }}>
        This island is hydrated on <b>visible</b>. Scroll down to see it{' '}
        <span style={{ fontSize: '1.5em', lineHeight: '1em' }}>&darr;</span>
      </div>
      <div style={{ marginTop: '1000px', padding: '20px' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Counter $client:visible count={30} />
        </Suspense>
      </div>
    </div>,
    { title: 'Comity | React renderer example' }
  );
