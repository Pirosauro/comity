import type { FC } from 'react';
import { useEffect, useState } from 'react';

type Props = {
  server?: string;
  client?: string;
};

export const Badge: FC<Props> = ({ client, server }) => {
  const [env, setEnv] = useState<string>(server || 'server');

  useEffect(() => {
    if (typeof window !== 'undefined') setEnv(client || 'client');
  });

  return <span>Hey {env}!</span>;
};

export default Badge;
