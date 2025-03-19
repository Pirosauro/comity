import type { FunctionalComponent } from 'vue';
import { withHydration } from '@comity/vue';
import { BadgeIsland } from './badge.island.js';
import { filename } from 'virtual:comity-islands';
import style from './counter.module.css';
import { defineComponent, ref } from 'vue';

export type Props = {
  count: number;
};
export const Counter = defineComponent({
  name: 'Counter',
  props: {
    count: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const count = ref(props.count);

    const onClickHandler = () => {
      const log = 'Click ' + count.value;

      count.value += 1;
      console.log(log + ' -> ' + count.value);
    };

    return () => (
      <>
        <div class={style.badge}>
          <BadgeIsland $client:load client="hydrated" server="SSR" />
        </div>
        <p class={style.count}>Count: {count.value}</p>
        <button class={style.button} onClick={onClickHandler}>
          Increment
        </button>
        <p>{filename}</p>
      </>
    );
  },
});

export const CounterIsland = withHydration(Counter, filename);

export default CounterIsland;
