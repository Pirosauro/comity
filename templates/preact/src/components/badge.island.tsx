import type { FunctionComponent as FC } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { withHydration } from '@comity/preact';
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
