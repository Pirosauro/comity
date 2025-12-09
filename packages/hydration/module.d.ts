declare module "*?meta" {
  type IslandMetadata = {
    id: string;
  };

  const meta: IslandMetadata;

  export default meta;
}
