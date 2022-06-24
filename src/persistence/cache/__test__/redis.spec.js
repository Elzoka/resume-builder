import redis_client from "@/persistence/cache/redis";
import config from "@/config";
import cache_key_generator from "@/persistence/utils/cache_key_generator";

describe("redis", () => {
  /**
   * @type {import('@/persistence').ICache}
   */
  let cache;

  beforeAll(() => {
    cache = redis_client(config);
  });

  afterAll(() => {
    cache.close();
  });

  beforeEach(async () => {
    await cache.flushAll();
  });

  describe("basic keys", () => {
    async function store_key() {
      const key = Math.floor(Math.random() * 1000) + "";
      const val = Math.floor(Math.random() * 1000) + "";

      await cache.set(key, val);

      return [key, val];
    }

    test("should store key", async () => {
      const [key, val] = await store_key();

      const cached_val = await cache.get(key);

      expect(cached_val).toEqual(val);
    });

    test("should delete key", async () => {
      const [key, val] = await store_key();

      const cached_val = await cache.get(key);
      expect(cached_val).toEqual(val);

      const deleted_val = await cache.del(key);
      expect(deleted_val).toEqual(val);

      const new_val = await cache.get(key);
      expect(new_val).toBeNull();
    });
  });

  describe("hash maps", () => {
    async function store_key() {
      const id = Math.floor(Math.random() * 1000) + "";
      const model_name = "resume";

      const body = {
        field1: "test1",
        field2: "test2",
        field3: "test3",
        field4: "test4",
      };

      await cache.hSet({ model_name: model_name, id, ...body });

      return { id, model_name, body };
    }

    test("should store object", async () => {
      const { model_name, id, body } = await store_key();

      const cached_val = await cache.hGet({ model_name, id });

      expect(cached_val).toEqual(expect.objectContaining({ id, ...body }));
    });

    test("should delete object", async () => {
      const { model_name, id, body } = await store_key();
      const entity_key = cache_key_generator(model_name, id);

      const cached_val = await cache.hDel({ model_name, id });
      expect(cached_val).toEqual(expect.objectContaining({ id, ...body }));

      const new_val = await cache.hGet(entity_key);
      expect(new_val).toEqual(null);
    });

    test("should update object", async () => {
      const { model_name, id, body } = await store_key();
      const updated_val = "updated_test";
      const updated_key = "field2";

      const cached_val = await cache.hSet({
        model_name,
        id,
        [updated_key]: updated_val,
      });

      expect(cached_val).toEqual(
        expect.objectContaining({ id, ...body, [updated_key]: updated_val })
      );
    });
  });
});
