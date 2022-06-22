import logger from "@/logger";

/**
 *
 * @param {import('@/config').IConfig} config
 * @param {{[x: string]: IModel}} models_config
 * @returns {import('@/persistence/database/mongodb').IDatabase}
 */
export default function create_client(config, models_config) {
  logger.info("initialize db connection");

  return {
    async get_object({ model_name, id }, options) {
      logger.info(`db.get_object ${model_name} with id ${id}`);
    },

    async create_object(
      { model_name, ...body },
      // { expand, author } = {}
      options = {}
    ) {
      logger.info(`db.create_object ${model_name} with body ${body}`);
    },

    async update_object(
      { model_name, id, ...body },
      // { expand, author } = {}
      options = {}
    ) {
      logger.info(
        `db.update_object ${model_name} with id ${id} and with body ${body}`
      );
    },

    async delete_object({ model_name, id }, options = {}) {
      logger.info(`db.delete_object ${model_name} with id ${id}`);
    },
    close: () => {
      logger.info("close connection");
      // close connection
    },
  };
}
