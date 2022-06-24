import logger from "@/logger";
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

    async hGet({ model_name, id }) {
      logger.info(`redis.hmGet ${model_name} with id ${id}`);
      const entity_key = cache_key_generator(model_name, id);

      const [fetched_object, exists] = await client
        .multi()
        .hGetAll(entity_key)
        .exists(entity_key)
        .exec();

      return exists ? fetched_object : null;
    },

    async hSet({ model_name, id, ...body }) {
      logger.info(`redis.hmSet ${model_name} with id ${id}`);
      const entity_key = cache_key_generator(model_name, id);

      const ordered_key_value_pairs = Object.entries(body).reduce(
        (acc, [key, val]) => acc.concat(key, String(val)),
        []
      );

      const fields = ["id", id, ...ordered_key_value_pairs];

      // create transaction to set entity and return result
      await client.sendCommand(["HMSET", entity_key, ...fields]);

      const created_object = await this.hGet({ model_name, id });

      return created_object;
    },
    async hDel({ model_name, id }) {
      logger.info(`redis.hmSet ${model_name} with id ${id}`);
      const entity_key = cache_key_generator(model_name, id);

      // create transaction to set entity and return result
      const [deleted_object] = await client
        .multi()
        .hGetAll(entity_key)
        .del(entity_key)
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
