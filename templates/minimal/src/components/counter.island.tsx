import type { FC, PropsWithChildren } from 'hono/jsx';
import { useState } from 'hono/jsx';
import { withHydration } from '@comity/islands';
import Badge from './badge.island.js';
import style from './counter.module.css';

export type Props = {
  count: number;
};

// test island inside island
const BadgeIsland = withHydration(Badge);

const Counter: FC<PropsWithChildren<Props>> = (props) => {
  const [count, setCount] = useState(props.count);
  const onClickHandler = () => {
    const log = 'Click ' + count;

    setCount(count + 1);
    console.log(log + ' -> ' + count);
  };

  return (
    <>
      <div className={style.badge}>
        <BadgeIsland client:load client="hydrated" server="SSR" />
      </div>
      <p className={style.count}>Count: {count}</p>
      <button className={style.button} onClick={onClickHandler}>
        Increment
      </button>
    </>
  );
};

export default Counter;
