import type { Context } from 'hono';
import { Suspense } from 'react';
import { Island } from '@comity/react/components';
import counter from '~/components/counter.island.js?hash';
import user from '~/components/user.island.js?hash';

export default async (ctx: Context) =>
  ctx.render(
    <div>
      <div style={{ backgroundColor: 'aquamarine', padding: '20px' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Island $client:load $component={user} />
        </Suspense>
      </div>
      <div style={{ padding: '30px 5px 5px' }}>
        This island is hydrated on <b>load</b>
      </div>
      <div style={{ backgroundColor: 'aliceblue', padding: '20px' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Island $client:load $component={counter} count={10} />
        </Suspense>
      </div>
      <div style={{ padding: '30px 5px 5px' }}>
        This island is hydrated on <b>idle</b>
      </div>
      <div style={{ backgroundColor: 'wheat', padding: '20px' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Island $client:idle $component={counter} count={20} />
        </Suspense>
      </div>
      <div style={{ padding: '30px 5px 5px' }}>
        This island is hydrated on <b>screen size &lt;= 600px</b>. Resize the
        screen to hydrate
      </div>
      <div style={{ backgroundColor: 'gold', padding: '20px' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Island
            $client:media="(max-width: 600px)"
            $component={counter}
            count={30}
          />
        </Suspense>
      </div>
      <div style={{ padding: '30px 5px 5px', lineHeight: '1.5em' }}>
        This island is hydrated on <b>visible</b>. Scroll down to see it{' '}
        <span style={{ fontSize: '1.5em', lineHeight: '1em' }}>&darr;</span>
      </div>
      <div style={{ marginTop: '1000px', padding: '20px' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Island $client:visible $component={counter} count={30} />
        </Suspense>
      </div>
    </div>,
    { title: 'Comity | React renderer example' }
  );
