import type { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

type Props = {
  server?: string;
  client?: string;
};

export const Badge: FunctionComponent<Props> = ({ client, server }) => {
  const [env, setEnv] = useState<string>(server || 'server');

  useEffect(() => {
    if (typeof window !== 'undefined') setEnv(client || 'client');
  });

  return <span>Hey {env}!</span>;
};

export default Badge;
