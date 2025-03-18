import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { withHydration } from '@comity/react';
import { filename } from 'virtual:comity-islands';

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

export const BadgeIsland = withHydration(Badge, filename);

export default BadgeIsland;
