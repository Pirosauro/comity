import type { FC } from 'hono/jsx';
import { useEffect, useState } from 'hono/jsx';
import { withHydration } from '@comity/islands';
import { filename } from 'virtual:comity-islands';

type Props = {
  server?: string;
  client?: string;
};

// testing island inside island
const Badge: FC<Props> = ({ client, server }) => {
  const [env, setEnv] = useState<string>(server || 'server');

  useEffect(() => {
    if (typeof window !== 'undefined') setEnv(client || 'client');
  });

  return <span>Hey {env}!</span>;
};

export const BadgeIsland = withHydration(Badge, filename);

export default BadgeIsland;
