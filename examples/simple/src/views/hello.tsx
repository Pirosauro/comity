import type { HelloViewModel } from "../view-models/hello.js";

import { Island } from "@comity/hydration-react";
import { lazy, Suspense } from "react";
import { Counter } from "../components/counter.js";
import { User } from "../components/user.js";
import { DefaultLayout } from "../themes/default/layout.js";

const LazyUserProfile = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import("../components/user-profile.js"));
    }, 10000);
  });
});

export function HelloView(props: HelloViewModel) {
  const data = { initial: 1 };

  return (
    <DefaultLayout title="">
      <h1>{props.title}</h1>
      <p>{props.message}</p>

      <Island
        data={{}}
        id={"user"}
        component={"user"}
        strategy={{
          kind: "immediate",
        }}
      >
        <User />
      </Island>

      <Suspense fallback={<div>Loading...</div>}>
        <LazyUserProfile />
      </Suspense>

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
