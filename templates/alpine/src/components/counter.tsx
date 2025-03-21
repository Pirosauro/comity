import type { FC, PropsWithChildren } from 'hono/jsx';
import { Badge } from './badge.js';
import style from './counter.module.css';

export type Props = {
  count: number;
};

export const Counter: FC<PropsWithChildren<Props>> = ({ count }) => {
  return (
    <>
      <div className={style.badge}>
        <Badge client="hydrated" server="SSR" />
      </div>
      <div x-data={`{ count: ${count} }`}>
        <p className={style.count}>
          Count: <span x-text="count">{count}</span>
        </p>
        <button className={style.button} {...{ '@click': 'count++' }}>
          Increment
        </button>
      </div>
    </>
  );
};
