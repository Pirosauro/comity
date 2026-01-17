import type { IslandContract } from "../contracts/island.js";

import { JsonIslandSerializer } from "../core/serializer.js";

/**
 * Renders a Comity island wrapper with embedded contract
 * 
 * @param children The island's inner HTML
 * @param contract The island's contract
 * @returns The complete island HTML
 */
export function renderIslandHtml(
  children: string,
  contract: IslandContract,
): string {
  const json = JsonIslandSerializer.serialize(contract);

  return `
<comity-island>
  ${children}
  <script type="application/json">
    ${json}
  </script>
</comity-island>
`.trim();
}