import type { HelloViewModel } from "../view-models/hello.js";

import { Island } from "@comity/hydration-react";
import { Counter } from "../components/counter.js";
import { DefaultLayout } from "../themes/default/layout.js";

export function HelloView(props: HelloViewModel) {
  const data = { initial: 1 };

  return (
    <DefaultLayout title="">
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
    </DefaultLayout>
  );
}
