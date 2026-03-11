import type { HttpContext } from "@comity/http";
import type { RouteMatch, RoutePolicyHandler } from "./contracts/route.js";
import type { Router, RouteResolutionContext } from "./contracts/router.js";
import type { UrlRewriter } from "./contracts/url-rewriter";

/**
 * RouterPipeline is a composite router that allows you to chain multiple routers and URL rewriters together. It implements the Router interface, enabling it to be used wherever a Router is expected. The pipeline processes incoming HTTP requests by first applying any registered URL rewriters to modify the request URL as needed, and then sequentially invoking each router in the order they were added until a match is found or all routers have been exhausted.
 *
 * @remarks
 * - The RouterPipeline does not enforce any specific order of routers or rewriters; it simply processes them in the order they were provided.
 * - URL rewriters are applied before route matching, allowing them to influence which routes are matched for a given request.
 * - If multiple routers are registered, the pipeline will return the first successful match it finds. If no routers match the request, it will return null.
 * - This design allows for flexible routing configurations, enabling developers to compose complex routing logic from simpler, modular components.
 */
export class RouterPipeline implements Router {
  /** The list of routers in the pipeline */
  #routers: Router[];

  /** The list of URL rewriters in the pipeline */
  #rewriters: UrlRewriter[];

  /** The list of route policies in the pipeline */
  #policies: Record<string, RoutePolicyHandler>;

  /**
   * @param routers - An array of Router instances to be included in the pipeline
   * @param rewriters - An array of UrlRewriter instances that will be applied to incoming request URLs before route matching occurs
   * @param policies - An optional record of route policy handlers that can be applied to routes during matching
   */
  constructor(
    routers: Router[],
    rewriters: UrlRewriter[],
    policies: Record<string, RoutePolicyHandler>
  ) {
    this.#routers = routers;
    this.#rewriters = rewriters;
    this.#policies = policies;
  }

  /**
   * @inheritdoc
   */
  async match(ctx: RouteResolutionContext): Promise<RouteMatch | null> {
    for (const r of this.#rewriters) {
      const rewritten = r.rewrite(ctx.url, ctx.http);

      if (rewritten) {
        ctx.url = rewritten;
      }
    }

    for (const r of this.#routers) {
      const match = await r.match(ctx);

      if (match) {
        await this.#applyPolicies(ctx.http, match);

        return match;
      }
    }

    return null;
  }

  /**
   * Applies any relevant route policies to the matched route.
   *
   * @param ctx - The HTTP context of the incoming request, which may contain additional information useful for policy evaluation.
   * @param match - The result of a successful route match, containing the matched route and any associated parameters.
   */
  async #applyPolicies(ctx: HttpContext, match: RouteMatch) {
    const policies = match.route.policies;

    if (!policies) return;

    for (const name of Object.keys(policies)) {
      const handler = this.#policies[name];

      if (!handler) continue;

      await handler(ctx, match, policies[name]);
    }
  }
}
