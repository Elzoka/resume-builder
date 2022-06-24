import logger from "@/logger";
import _ from "lodash";
import { createClient } from "redis";
import cache_key_generator from "../utils/cache_key_generator";

/**
 *
 * @param {import('@/config').IConfig} config
 * @returns {import('@/persistence').ICache}
 */
export default function create_client(config) {
  logger.info("initialize cache connection");

  const client = createClient({
    url: config.redis_url,
  });

  client.connect();
  return {
    async get(key) {
      logger.info(`redis.get ${key}`);
      return client.get(key);
    },

    async set(key, value) {
      logger.info(`redis.set ${key}`);
      const [, cached_val] = await client
        .multi()
        .set(key, value)
        .get(key)
        .exec();

      return cached_val;
    },
    async del(key) {
      logger.info(`redis.del ${key}`);
      const [cached_val] = await client.multi().get(key).del(key).exec();

      return cached_val;
    },

    async json_get({ model_name, id }, options = {}) {
      logger.info(`redis.hmGet ${model_name} with id ${id}`);
      const entity_key = cache_key_generator(model_name, id, options.user?.id);

      const fetched_object = client.json.get(entity_key);

      return fetched_object;
    },

    async json_create({ model_name, id, ...body }, options = {}) {
      logger.info(`redis.hmSet ${model_name} with id ${id}`);
      const entity_key = cache_key_generator(model_name, id, options.user?.id);

      const [, created_object] = await client
        .multi()
        .json.set(entity_key, "$", {
          id,
          ...body,
        })
        .json.get(entity_key)
        .exec();

      return created_object;
    },

    async json_update({ model_name, id, ...body }, options = {}) {
      logger.info(`redis.hmSet ${model_name} with id ${id}`);
      const entity_key = cache_key_generator(model_name, id, options.user?.id);

      const stored_val = await this.json_get({ model_name, id });

      const [, updated_object] = await client
        .multi()
        .json.set(entity_key, "$", {
          id,
          ..._.merge(stored_val, body),
        })
        .json.get(entity_key)
        .exec();

      return updated_object;
    },

    async json_del({ model_name, id }, options = {}) {
      logger.info(`redis.hmSet ${model_name} with id ${id}`);
      const entity_key = cache_key_generator(model_name, id, options.user?.id);

      // create transaction to set entity and return result
      const [deleted_object] = await client
        .multi()
        .json.get(entity_key, "$")
        .json.del(entity_key)
        .exec();

      return deleted_object;
    },
    flushAll: () => {
      return client.flushAll();
    },
    close: () => {
      logger.info("close connection");
      // close connection
      return client.quit();
    },
  };
}
