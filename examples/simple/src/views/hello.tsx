import type { HelloViewModel } from "../view-models/hello.js";

import { Counter } from "../components/counter.js";
// import { Island } from "../hydration/island.js";
import { Island } from "@comity/hydration-react";

export function HelloView(props: HelloViewModel) {
  const data = { initial: 1 };

  return (
    <>
      <h1>{props.title}</h1>
      <p>{props.message}</p>

      <Island
        data={data}
        id={"counter"}
        component={"counter"}
        strategy={{
          kind: "immediate",
        }}
      >
        <Counter {...data} />
      </Island>
    </>
  );
}
