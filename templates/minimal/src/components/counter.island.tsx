import type { FC, PropsWithChildren } from 'hono/jsx';
import { useState } from 'hono/jsx';
import { Island } from '@comity/islands/components';
import badge from './badge.island.js?hash';
import style from './counter.module.css';

export type Props = {
  count: number;
};

export const Counter: FC<PropsWithChildren<Props>> = (props) => {
  const [count, setCount] = useState(props.count);
  const onClickHandler = () => {
    const log = 'Click ' + count;

    setCount(count + 1);
    console.log(log + ' -> ' + count);
  };

  return (
    <>
      {/* <div className={style.badge}>
        <Island
          $client:load
          $component={badge}
          client="hydrated"
          server="SSR"
        />
      </div> */}
      <p className={style.count}>Count: {count}</p>
      <button className={style.button} onClick={onClickHandler}>
        Increment
      </button>
    </>
  );
};

export default Counter;
