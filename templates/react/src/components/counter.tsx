import type { FunctionComponent, PropsWithChildren } from 'react';
import { useState } from 'react';
import { Badge } from './badge.js';
import hey from './badge.js?filename';
import style from './counter.module.css';

export type Props = {
  count: number;
};

export const Counter: FunctionComponent<PropsWithChildren<Props>> = (props) => {
  const [count, setCount] = useState(props.count);
  const onClickHandler = () => {
    const log = 'Click ' + count;

    setCount(count + 1);
    console.log(log + ' -> ' + count);
  };

  return (
    <>
      <div className={style.badge}>
        <Badge $client:load client="hydrated" server="SSR" />
      </div>
      <p className={style.count}>Count: {count}</p>
      <button className={style.button} onClick={onClickHandler}>
        Increment
      </button>
      <p>{hey}</p>
    </>
  );
};

export default Counter;
