import type { FC } from 'hono/jsx';
import { useEffect, useState } from 'hono/jsx';

type Props = {
  server?: string;
  client?: string;
};

// testing island inside island
export const Badge: FC<Props> = ({ client, server }) => {
  const [env, setEnv] = useState<string>(server || 'server');

  useEffect(() => {
    if (typeof window !== 'undefined') setEnv(client || 'client');
  });

  return <span>Hey {env}!</span>;
};

export default Badge;
