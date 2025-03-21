import type { FC } from 'hono/jsx';

type Props = {
  server?: string;
  client?: string;
};

export const Badge: FC<Props> = ({ client, server }) => {
  return (
    <div x-data={`{ env: '${client || 'Client'}' }`}>
      <span x-text="env">Hey {server || 'Server'}!</span>
    </div>
  );
};
