import errors from "@/errors";
import logger from "@/logger";
import mongodb from "@/persistence/database/mongodb";

/**
 * @callback IGetObject
 * @param {{model_name: string, id: string}} body
 * @param {object} options
 * @return {Promise<any>}
 *
 *
 * @callback ICreateObject
 * @param {{model_name: string, id: string, [x: string]: any}} body
 * @param {object} options
 * @return {Promise<any>}
 *
 * @callback IUpdateObject
 * @param {{model_name: string, id: string, [x: string]: any}} body
 * @param {object} options
 * @return {Promise<any>}
 *
 * @callback IDeleteObject
 * @param {{model_name: string, id: string}} body
 * @param {object} options
 * @return {Promise<any>}
 *
 */

/**
 * @typedef IDatabase
 * @property {IGetObject} get_object
 * @property {ICreateObject} create_object
 * @property {IUpdateObject} update_object
 * @property {IDeleteObject} delete_object
 *
 */

/**
 * @typedef {keyof typeof import('@/persistance/models')} IModalKeys
 */

const database_drivers = {
  mongodb,
};

/**
 *
 * @param {import('@/config').IConfig} config
 * @param {{[x: string]: IModel}} models
 * @returns {IDatabase}
 */
export default function create_client(config, models) {
  logger.info("initializing persistence");

  logger.info("initializing database driver");

  const database_driver = database_drivers[config.database];

  if (!database_driver) {
    logger.error("database driver not selected, please check your env file");
    process.exit();
  }

  logger.info("selected database driver", { driver: config.database });

  /** @type {IDatabase} */
  const db = database_driver(config, models);

  logger.info("persistence drivers initialized");

  /**
   *
   * @param {string} model_name
   * @return {IModel}
   */
  function get_model_config(model_name) {
    const model_config = models[model_name];

    if (!model_config) {
      throw errors.invalid_resource();
    }

    return model_config;
  }

  /**
   * @type {IDatabase}
   */
  const persistence = {
    async get_object({ model_name, id }, options) {
      logger.info(`persistence.get_object ${model_name}`);
      const model_config = get_model_config(model_name);

      const fetched_object = await db.get_object({ model_name, id }, options);

      return fetched_object;
    },

    async create_object(
      { model_name, ...body },
      // { expand, author } = {}
      options = {}
    ) {
      logger.info(`persistence.create_object ${model_name}`);
      const model_config = get_model_config(model_name);

      // TODO: add cache
      // TODO: run validators
      // TODO: add Pub/Sub (db hooks)

      const created_object = await db.create_object(
        { model_name, ...body },
        options
      );

      return created_object;
    },

    async update_object(
      { model_name, id, ...body },
      // { expand, author } = {}
      options = {}
    ) {
      logger.info(`persistence.update_object ${model_name}`);
      const model_config = get_model_config(model_name);

      const updated_object = db.update_object(
        { model_name, id, ...body },
        options
      );

      return updated_object;
    },

    async delete_object({ model_name, id }, options = {}) {
      logger.info(`persistence.delete_object ${model_name}`);
      const model_config = get_model_config(model_name);

      const deleted_object = db.delete_object({ model_name, id }, options);

      return deleted_object;
    },
  };
  return persistence;
}
