import { useState } from "react";

export interface CounterProps {
  initial: number;
}

export function Counter({ initial }: CounterProps) {
  const [count, setCount] = useState(initial);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}

export default Counter;
