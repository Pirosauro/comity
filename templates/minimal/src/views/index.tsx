import type { Context } from 'hono';
import { Island } from '@comity/islands/components';
import counter from '~/components/counter.island.js?hash';

console.log('CCC', counter);

export default async (ctx: Context) =>
  ctx.render(
    <div>
      <div style={{ padding: '30px 5px 5px' }}>
        This island is hydrated on <b>load</b>
      </div>
      <div style={{ backgroundColor: 'aliceblue', padding: '20px' }}>
        {/* {await Island({ '$client:load': true, $component: counter, count: 10 })} */}
        <Island $client:load $component={counter} count={10} />
      </div>
      <div style={{ padding: '30px 5px 5px' }}>
        This island is hydrated on <b>idle</b>
      </div>
      <div style={{ backgroundColor: 'wheat', padding: '20px' }}>
        {await Island({ '$client:idle': true, $component: counter, count: 10 })}
        {/* <Island $client:idle $component={counter} count={20} /> */}
      </div>
      <div style={{ padding: '30px 5px 5px' }}>
        This island is hydrated on <b>screen size &lt;= 600px</b>. Resize the
        screen to hydrate
      </div>
      <div style={{ backgroundColor: 'gold', padding: '20px' }}>
        {await Island({
          '$client:media': '(max-width: 600px)',
          $component: counter,
          count: 10,
        })}
        {/* <Island
          $client:media="(max-width: 600px)"
          $component={counter}
          count={30}
        /> */}
      </div>
      <div style={{ padding: '30px 5px 5px', lineHeight: '1.5em' }}>
        This island is hydrated on <b>visible</b>. Scroll down to see it{' '}
        <span style={{ fontSize: '1.5em', lineHeight: '1em' }}>&darr;</span>
      </div>
      <div style={{ marginTop: '1000px', padding: '20px' }}>
        {await Island({
          '$client:visible': true,
          $component: counter,
          count: 30,
        })}
        {/* <Island $client:visible $component={counter} count={30} /> */}
      </div>
    </div>,
    { title: 'Comity | Hono renderer example' }
  );
