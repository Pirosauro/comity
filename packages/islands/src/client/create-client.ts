import type { HydrationData } from '../../types/module.js';
import { idle, observeOnce, listenMediaOnce } from './strategies.js';

type Options<C, P> = {
  debug: boolean;
  components: Record<string, () => Promise<Record<string, C>>>;
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
  components,
  integrations,
}: Options<C, P>): Promise<void> => {
  const index: Record<string, Record<string, C> | undefined> = {};

  /**
   * Log a console message
   *
   * @param {string} message - The message to display
   * @param {"info" | "warn" | "error"} level - The log level
   * @return {void}
   */
  const logMessage = (
    message: string,
    level: 'info' | 'warn' | 'error'
  ): void => {
    if (level !== 'info' || debug) console[level]('[comity-island] ' + message);
  };

  /**
   * Load a component
   *
   * @async
   * @param {string} module - The component module
   * @return {(Promise<C | undefined>)}
   */
  const loadComponent = async (
    module: string,
    name: string
  ): Promise<C | undefined> => {
    if (
      typeof index[module] === 'undefined' &&
      typeof components?.[module] === 'function'
    ) {
      const loader = components[module];

      index[module] = await loader();
    }

    return index[module]?.[name];
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
      if (document.readyState === 'loading') {
        const initBound = this._init.bind(this);
        const initOnce = () => {
          document.removeEventListener('DOMContentLoaded', initOnce);
          initBound();
        };

        document.addEventListener('DOMContentLoaded', initOnce);
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
      // Collect hydration data
      this.#data = JSON.parse(this.dataset.island || '{}');

      // No hydration data found
      if (!this.#data?.component) {
        return logMessage(
          'Unable to hydrate Island: missing hydration information',
          'warn'
        );
      }

      const { component: module, strategy } = this.#data;

      // Island is a descendant of another island
      if (this.parentElement?.closest('comity-island')) {
        return logMessage(
          `Island "${module}" is a descendant of another island`,
          'info'
        );
      }

      logMessage(`Island "${module}" initialized`, 'info');

      switch (strategy?.type) {
        // Hydrate on load
        case 'load':
          this.hydrate().then(() =>
            logMessage(`Island "${module}" hydrated on load`, 'info')
          );
          break;

        // Hydrate on idle
        case 'idle':
          idle(() =>
            this.hydrate().then(() =>
              logMessage(`Island "${module}" hydrated on idle`, 'info')
            )
          );
          break;

        // Hydrate on media query match
        case 'media':
          if (strategy?.value) {
            listenMediaOnce(strategy.value, () =>
              this.hydrate().then(() =>
                logMessage(
                  `Island "${module}" hydrated on media query match (${strategy.value})`,
                  'info'
                )
              )
            );
          }
          break;

        // Hydrate on visible
        case 'visible':
          observeOnce(this, () =>
            this.hydrate().then(() =>
              logMessage(`Island "${module}" hydrated on visible`, 'info')
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
      const {
        framework,
        component: module,
        props,
      } = this.#data as HydrationData;

      try {
        const integration = integrations[framework];

        // Integration not found
        if (!integration) {
          throw new Error(`Integration "${framework}" is not defined`);
        }

        const [hash, name] = module.split('.');
        // Load component
        const component = await loadComponent(hash, name);

        // Component not loaded
        if (!component) {
          throw new Error(`Loading of component "${module}" has failed`);
        }

        await integration(component, props, this);
      } catch (e: any) {
        logMessage(`Unable to hydrate Island: ${e.message}`, 'error');
      }
    }
  }

  // Define custom element
  if ('customElements' in window) {
    window.customElements.define('comity-island', Island);
  }
};
