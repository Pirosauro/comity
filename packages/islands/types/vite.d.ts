declare module "virtual:comity-island" {
  const islands: Record<string, () => Promise<unknown>>;

  export default islands;
}

declare module "virtual:comity-routes" {
  const routes: Record<string, Handler>;

  export default routes;
}
