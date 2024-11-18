import type { HydrationData } from "../../types/index.d.js";
import { idle, observeOnce, listenMediaOnce } from "../strategies.js";

type Options<C, P> = {
  debug: boolean;
  islands: Record<string, () => Promise<{ default: C }>>;
  integrations: Record<
    string,
    (component: C, props: P, element: HTMLElement) => Promise<void>
  >;
};

/**
 * Create a client
 *
 * @param {Options} options - The client's options
 * @return {Promise<void>}
 */
export const createClient = async <C, P>({
  debug,
  islands,
  integrations,
}: Options<C, P>): Promise<void> => {
  const components: Record<string, C | undefined> = {};

  /**
   * Log a console message
   *
   * @param {string} message - The message to display
   * @param {"info" | "warn" | "error"} level - The log level
   * @return {void}
   */
  const logMessage = (
    message: string,
    level: "info" | "warn" | "error"
  ): void => {
    if (level !== "info" || debug) console[level]("[comity-island] " + message);
  };

  /**
   * Load a component
   *
   * @async
   * @param {string} name - The component name
   * @return {(Promise<C | undefined>)}
   */
  const loadComponent = async (name: string): Promise<C | undefined> => {
    if (!(name in components)) {
      components[name] =
        typeof islands?.[name] === "function"
          ? (await islands[name]())?.default
          : undefined;
    }

    return components[name];
  };

  class Island extends HTMLElement {
    #data!: HydrationData | undefined;

    /**
     * Constructor
     */
    constructor() {
      super();
    }

    /**
     * @inheritdoc
     */
    connectedCallback() {
      if (document.readyState === "loading") {
        const initBound = this._init.bind(this);
        const initOnce = () => {
          document.removeEventListener("DOMContentLoaded", initOnce);
          initBound();
        };

        document.addEventListener("DOMContentLoaded", initOnce);
      } else {
        this._init();
      }
    }

    /**
     * Initialize the island
     *
     * @returns {void}
     */
    _init(): void {
      // collect information
      const json = this.querySelector(
        ":scope > script[data-island]"
      )?.textContent;
      this.#data = json ? JSON.parse(json) : {};

      // no information to hydrate
      if (!this.#data?.name) {
        return logMessage(
          "Unable to hydrate Island: missing hydration information",
          "warn"
        );
      }

      const { name, strategy } = this.#data;

      // component not found
      if (!(name in islands)) {
        return logMessage(
          'Unable to hydrate Island: component "' + name + '" not found',
          "warn"
        );
      }

      // island is a descendant of another island
      if (this.parentElement?.closest("comity-island")) {
        return logMessage(
          'Island "' + name + '" is a descendant of another island',
          "info"
        );
      }

      logMessage('Island "' + name + '" initialized', "info");

      switch (strategy?.type) {
        // hydrate on load
        case "load":
          this.hydrate().then(() =>
            logMessage('Island "' + name + '" hydrated on load', "info")
          );
          break;

        // hydrate on idle
        case "idle":
          idle(() =>
            this.hydrate().then(() =>
              logMessage('Island "' + name + '" hydrated on idle', "info")
            )
          );
          break;

        // hydrate on media query match
        case "media":
          if (strategy?.value) {
            listenMediaOnce(strategy.value, () =>
              this.hydrate().then(() =>
                logMessage(
                  'Island "' +
                    name +
                    '" hydrated on media query match (' +
                    strategy.value +
                    ")",
                  "info"
                )
              )
            );
          }
          break;

        // hydrate on visible
        case "visible":
          observeOnce(this, () =>
            this.hydrate().then(() =>
              logMessage('Island "' + name + '" hydrated on visible', "info")
            )
          );
          break;
      }
    }

    /**
     * Hydrate the island
     *
     * @return {Promise<void>}
     */
    async hydrate(): Promise<void> {
      const { framework, name, props } = this.#data as HydrationData;

      try {
        const integration = integrations[framework];

        // integration not found, no hydration as well
        if (!integration) {
          throw new Error('integration "' + framework + '" is not defined');
        }

        // load component
        const component = await loadComponent(name);

        // component not loaded
        if (!component) {
          throw new Error('loading of component "' + name + '" has failed');
        }

        await integration(component, props, this);
      } catch (e: any) {
        logMessage("Unable to hydrate Island: " + e.message, "error");
      }
    }
  }

  // define
  if ("customElements" in window) {
    window.customElements.define("comity-island", Island);
  }
};
