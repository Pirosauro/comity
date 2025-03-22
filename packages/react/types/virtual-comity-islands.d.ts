declare module 'virtual:comity-islands' {
  const components: Record<string, () => Promise<any>>;
  export = components;
}
