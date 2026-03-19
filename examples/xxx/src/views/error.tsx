import type { ErrorViewModel } from "../view-models/error.js";

export function ErrorView(props: ErrorViewModel) {
  return (
    <>
      <h1 style={{ color: "red" }}>{props.title}</h1>
      <p>{props.message}</p>
    </>
  );
}
