import { withHydration } from '@comity/react';
import hash from './counter.js?island';
import { Counter } from './counter.js';

export const CounterIsland = withHydration(Counter, hash);

export default Counter;
