/**
 * Discovery adapter contract.
 */
export interface IslandDiscoveryAdapter {
  /** Attaches the discovery mechanism. */
  attach(): void;

  /** Detaches the discovery mechanism. */
  detach(): void;
}
