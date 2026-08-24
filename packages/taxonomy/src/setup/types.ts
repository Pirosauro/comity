import type { ModuleSetupContext } from "@comity/composition/setup";
import type { TaxonomyRepository } from "../contracts/taxonomy-repository.js";
import type { TAXONOMY_REPOSITORY_TOKEN } from "./constants.js";

/** Hooks exposed by the module */
export type TaxonomyModuleHooks = {};

/** Events emitted by the module */
export type TaxonomyModuleEvents = {};

/**
 * Services exposed by the module
 */
export type TaxonomyModuleServices = {
  /** Taxonomy repository resolver token */
  [TAXONOMY_REPOSITORY_TOKEN]: TaxonomyRepository;
};

/**
 * Context provided to the taxonomy module setup function.
 */
export interface TaxonomyModuleContext extends ModuleSetupContext<
  TaxonomyModuleServices,
  TaxonomyModuleEvents,
  TaxonomyModuleHooks
> {}