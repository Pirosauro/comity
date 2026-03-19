import type { CategoryRepository } from "../magento/repositories/category.js";

/**
 * The `GetCategory` class is a use case that encapsulates the logic for fetching a category tree by its unique identifier (ID). It utilizes an instance of `CategoryRepository` to interact with the GraphQL API and retrieve the necessary category data. The `execute` method takes an ID as input and returns the corresponding category tree data, allowing other parts of the application to access and utilize this information as needed.
 */
export class GetCategory {
  /**  */
  #repository: CategoryRepository;

  /**
   * @param repository - An instance of `CategoryRepository` used to fetch category data.
   */
  constructor(repository: CategoryRepository) {
    this.#repository = repository;
  }

  /**
   * Fetches a category tree by its unique identifier (UID) using the repository. This method delegates the task of retrieving the category data to the `CategoryRepository`, which interacts with the GraphQL API to obtain the necessary information. The method returns the category tree data associated with the provided UID, allowing other parts of the application to access and utilize this information as needed.
   *
   * @param uid - The unique identifier of the category to be fetched.
   *
   * @returns A promise that resolves to the category tree data associated with the provided UID.
   */
  async execute(uid: string) {
    return this.#repository.getByUid(uid);
  }
}
