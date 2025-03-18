import type { FunctionComponent, ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { withHydration } from '@comity/preact';
import { filename } from 'virtual:comity-islands';
import { BadgeIsland } from './badge.island.js';
import style from './counter.module.css';

export type Props = {
  count: number;
  children?: ComponentChildren;
};

export const Counter: FunctionComponent<Props> = (props) => {
  const [count, setCount] = useState(props.count);
  const onClickHandler = () => {
    const log = 'Click ' + count;

    setCount(count + 1);
    console.log(log + ' -> ' + count);
  };

  return (
    <>
      <div className={style.badge}>
        <BadgeIsland $client:load client="hydrated" server="SSR" />
      </div>
      <p className={style.count}>Count: {count}</p>
      <button className={style.button} onClick={onClickHandler}>
        Increment
      </button>
    </>
  );
};

export const CounterIsland = withHydration(Counter, filename);

export default CounterIsland;
