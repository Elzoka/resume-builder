import errors from "@/errors";
import logger from "@/logger";
import mongodb from "@/persistence/database/mongodb";
import redis_client from "@/persistence/cache/redis";
import id_generator from "./utils/id_generator";
import validators, { runFieldsValidators } from "./validators";

/**
 * @callback IGetObject
 * @param {{model_name: string, id: string}} body
 * @param {object} options
 * @return {Promise<any>}
 *
 *
 * @callback ICreateObject
 * @param {{model_name: string, id?: string, [x: string]: any}} body
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
 * @typedef IDatabase
 * @property {IGetObject} get_object
 * @property {ICreateObject} create_object
 * @property {IUpdateObject} update_object
 * @property {IDeleteObject} delete_object
 * @property {() => void} close
 * @property {() => void} truncate
 */

/**
 * ICache
 * @callback IGetKey
 * @param {string} key
 * @return {Promise<string>}
 *
 * @callback ISetKey
 * @param {string} key
 * @param {string} value
 * @return {Promise<number>}
 *
 * @callback IDelKey
 * @param {string} key
 * @return {Promise<number>}
 *
 * @callback IHGetKey
 * @param {{model_name: string, id: string}} body
 * @return {Promise<any>}
 *
 * @callback IHSetKey
 * @param {{model_name: string, id: string, [x: string]: string}} body
 * @return {Promise<any>}
 *
 * @callback IHDelKey
 * @param {{model_name: string, id: string}} body
 * @return {Promise<any>}
 *
 * @callback IFlushAll
 * @return {Promise<void>}
 *
 * @callback IClose
 * @return {Promise<void>}
 *
 *
 * @typedef ICache
 * @property {IGetKey} get
 * @property {ISetKey} set
 * @property {IDelKey} del
 * @property {IHGetKey} hGet
 * @property {IHSetKey} hSet
 * @property {IHDelKey} hDel
 * @property {IFlushAll} flushAll
 * @property {IClose} close
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

  logger.info("initializing redis cache");
  const cache = redis_client(config);

  logger.info("initialized local cache");

  /** @type {Object.<string, ICache>} */
  const cachers = {
    cache,
    // local cache if needed
  };

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

      const { persistence_level } = model_config.config;

      // if entity is only stored on cache level
      let cached_object;
      if (persistence_level.includes("cache")) {
        const { cache } = cachers;

        cached_object = await cache.hGet({ model_name, id });
      }

      // return value either way if not existed on db
      if (!persistence_level.includes("db")) {
        logger.info(`return ${model_name} stored on cache level`);

        if (!cached_object) {
          throw errors.not_found();
        }

        return cached_object;
      }

      // get to persistence level

      if (cached_object) {
        logger.info("cache hit");
        return cached_object;
      }

      logger.info("cache miss");
      const fetched_object = await db.get_object({ model_name, id }, options);

      if (!fetched_object) {
        throw errors.not_found();
      }

      return fetched_object;
    },

    async create_object(
      { model_name, ...body },
      // { expand, author } = {}
      options = {}
    ) {
      logger.info(`persistence.create_object ${model_name}`);
      const model_config = get_model_config(model_name);

      logger.info("run validators");
      const { valid, invalid_fields } = runFieldsValidators(model_config, body);

      if (!valid) {
        logger.info("validation error");
        throw errors.validation_error(invalid_fields);
      }

      logger.info("valid request body");
      const { persistence_level } = model_config.config;
      const { cache } = cachers;

      const id = id_generator();

      if (
        persistence_level.length === 1 &&
        persistence_level.includes("cache")
      ) {
        logger.info("set from cache layer only");
        return cache.hSet({ model_name, id, ...body });
      }

      // TODO: add Pub/Sub (db hooks)

      logger.info(`persist object on the db with id ${id}`);
      const created_object = await db.create_object(
        { model_name, id, ...body },
        options
      );

      if (persistence_level.includes("cache")) {
        logger.info("cache the newly created object");
        cache.hSet({ model_name, id, ...created_object });
      }

      return created_object;
    },

    async update_object(
      { model_name, id, ...body },
      // { expand, author } = {}
      options = {}
    ) {
      logger.info(`persistence.update_object ${model_name} with id: ${id}`);
      const model_config = get_model_config(model_name);

      logger.info("run validation");
      const { valid, invalid_fields } = runFieldsValidators(
        model_config,
        body,
        true
      );

      if (!valid) {
        logger.info("validation error");
        throw errors.validation_error(invalid_fields);
      }

      logger.info("valid request body");

      // will fetch object and throw if not found
      await this.get_object({ model_name, id });

      const { persistence_level } = model_config.config;
      const { cache } = cachers;
      if (
        persistence_level.length === 1 &&
        persistence_level.includes("cache")
      ) {
        logger.info("update on cache level only");
        return cache.hSet({ model_name, id, ...body });
      }

      // TODO: add Pub/Sub (db hooks)
      logger.info("persist the updates on db layer");
      const updated_object = await db.update_object(
        { model_name, id, ...body },
        options
      );

      if (persistence_level.includes("cache")) {
        logger.info("persist the updates on cache layer");
        cache.hSet({ model_name, id, ...updated_object });
      }

      return updated_object;
    },

    async delete_object({ model_name, id }, options = {}) {
      logger.info(`persistence.delete_object ${model_name} with id: ${id}`);
      const model_config = get_model_config(model_name);

      logger.info("check that object exists");
      // will fetch object and throw if not found
      await this.get_object({ model_name, id });

      const { persistence_level } = model_config.config;
      const { cache } = cachers;

      if (
        persistence_level.length === 1 &&
        persistence_level.includes("cache")
      ) {
        logger.info("delete from cache layer only");
        return cache.hDel({ model_name, id });
      }

      logger.info("delete object from db layer");
      const deleted_object = await db.delete_object(
        { model_name, id },
        options
      );
      if (persistence_level.includes("cache")) {
        logger.info("delete object from cache layer");
        cache.hDel({ model_name, id });
      }

      return deleted_object;
    },
    truncate() {
      // db truncate
      cache.flushAll();
    },
    close() {
      // db close
      cache.close();
    },
  };
  return persistence;
}
