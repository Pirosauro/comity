import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";

type Props = {
  server?: string;
  client?: string;
};

// testing island inside island
const Badge: FunctionComponent<Props> = ({ client, server }) => {
  const [env, setEnv] = useState<string>(server || "server");

  useEffect(() => {
    if (typeof window !== "undefined") setEnv(client || "client");
  });

  return <span>Hey {env}!</span>;
};

export default Badge;
