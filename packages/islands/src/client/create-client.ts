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
 *
 * @param {Options} options - The client's options
 */
export const createClient = async <C, P>({
  debug,
  islands,
  integrations,
}: Options<C, P>) => {
  const components: Record<string, C | undefined> = {};

  /**
   * Log a console message
   *
   * @param {string} message - The message to display
   */
  const logMessage = (message: string, level: "info" | "warn" | "error") => {
    if (level !== "info" || debug) console[level]("[comity-island] " + message);
  };

  /**
   * Load a component
   *
   * @param {string} name - The component name
   * @return {(Promise<C | undefined>)}
   */
  const loadComponent = async (name: string): Promise<C | undefined> => {
    if (!(name in components)) {
      components[name] =
        name in islands ? (await islands[name]())?.default : undefined;
    }

    return components[name];
  };

  /**
   * Initialize islands architecture
   */
  const init = () => {
    document.querySelectorAll("script[data-island]").forEach((e) => {
      if (!e.textContent) {
        return;
      }

      const data: HydrationData = JSON.parse(e.textContent);

      console.log("Initilize", e.getAttribute("data-island"), data);
    });
  };

  if (document.readyState === "loading") {
    // Loading hasn't finished yet
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // `DOMContentLoaded` has already fired
    init();
  }

  class Island extends HTMLElement {
    #data!: HydrationData | undefined;

    /**
     *
     */
    constructor() {
      super();
    }

    /**
     * Mount
     */
    async connectedCallback() {
      this.#data = await this.init();

      if (!this.#data?.name) {
        return logMessage(
          "Unable to hydrate Island: missing hydration information",
          "warn"
        );
      }

      const { name, strategy } = this.#data;

      if (!(name in islands)) {
        return logMessage(
          'Unable to hydrate Island: component "' + name + '" not found',
          "warn"
        );
      }

      if (this.parentElement?.closest("comity-island")) {
        return logMessage(
          'Island "' + name + '" is a descendant of another island',
          "info"
        );
      }

      switch (strategy?.type) {
        case "load":
          await this.hydrate();
          break;

        case "idle":
          idle(() =>
            this.hydrate().then(() =>
              logMessage('component "' + name + '" hydrated on IDLE', "info")
            )
          );
          break;

        case "media":
          if (strategy?.value) {
            listenMediaOnce(strategy.value, () =>
              this.hydrate().then(() =>
                logMessage(
                  'component "' +
                    name +
                    '" hydrated on MEDIA ' +
                    strategy.value,
                  "info"
                )
              )
            );
          }
          break;

        case "visible":
          observeOnce(this, () =>
            this.hydrate().then(() =>
              logMessage('component "' + name + '" hydrated on VISIBLE', "info")
            )
          );
          break;
      }
    }

    /**
     * Init custom web element
     *
     * @return {Promise<HydrationData | undefined>}
     */
    async init(): Promise<HydrationData | undefined> {
      return new Promise<HydrationData | undefined>((resolve, reject) => {
        const json = this.querySelector(
          ":scope > script[data-island]"
        )?.textContent;

        json ? resolve(JSON.parse(json)) : reject();
      });
    }

    /**
     * Hydrate
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
