jest.mock("@/config", () => {
  const config = jest.requireActual("@/config").default;
  return {
    ...config,
    redis_url: config.test_redis_url,
  };
});

import config from "@/config";
import errors from "@/errors";
import persistence_lib from "@/persistence";
import _ from "lodash";
import validators from "../validators";

// override db
describe("persistence (cache layer only)", () => {
  /**
   * @type {import("@/persistence").IDatabase}
   */
  let persistence;

  /**
   * @type {{[x: string]: IModel}}
   */
  const model_configs = {
    student: {
      config: {
        persistence_level: ["cache"],
      },
      fields: {
        name: {
          type: "string",
          validators: [validators.required()],
        },
        age: {
          type: "number",
          // validators: [validators.number],
        },
      },
    },
  };

  beforeAll(async () => {
    // init_persistence
    persistence = await persistence_lib(config, model_configs);
  });

  afterAll(() => {
    // close db;
    persistence.close();
  });

  beforeEach(async () => {
    await persistence.truncate();
  });

  describe("create_object", () => {
    const object_body = {
      model_name: "student",
      name: "mahmoud",
      age: 24,
    };

    test("fail validation", async () => {
      const create_object = persistence.create_object(
        _.omit(object_body, "name")
      );

      const expected_error = errors.validation_error(
        expect.arrayContaining([
          {
            field_key: "name",
            validator_name: "required",
          },
          {
            field_key: "name",
            validator_name: "string",
          },
        ])
      );

      await expect(create_object).rejects.toEqual(expected_error);
    });

    test("fail invalid resource", async () => {
      const create_object = persistence.create_object({
        ...object_body,
        model_name: "invalid",
      });

      const expected_error = errors.invalid_resource();

      await expect(create_object).rejects.toEqual(expected_error);
    });

    test("create object successfully", async () => {
      const created_object = await persistence.create_object(object_body);

      expect(created_object).toEqual(
        expect.objectContaining({
          name: object_body.name,
          age: object_body.age,
        })
      );

      expect(created_object.id).toBeTruthy();
    });
  });

  describe("get_object", () => {
    test("not found resource", async () => {
      const fetch_object = persistence.get_object({
        model_name: "student",
        id: 1,
      });

      const expected_error = errors.not_found();
      await expect(fetch_object).rejects.toEqual(expected_error);
    });

    test("get object successfully", async () => {
      const created_object = await persistence.create_object({
        model_name: "student",
        name: "mahmoud",
        age: 24,
      });

      const fetched_object = await persistence.get_object({
        model_name: "student",
        id: created_object.id,
      });

      expect(fetched_object).toEqual(created_object);
    });
  });

  describe("update_object", () => {
    test("not found resource", async () => {
      const update_object = persistence.update_object({
        model_name: "student",
        id: 1,
      });

      const expected_error = errors.not_found();
      await expect(update_object).rejects.toEqual(expected_error);
    });

    test("update object successfully", async () => {
      const created_object = await persistence.create_object({
        model_name: "student",
        name: "mahmoud",
        age: 24,
      });
      const update = {
        name: "Ahmed",
      };

      const updated_object = await persistence.update_object({
        model_name: "student",
        id: created_object.id,
        ...update,
      });

      expect(updated_object).toEqual({
        ...created_object,
        ...update,
      });
    });
  });

  describe("delete_object", () => {
    test("not found resource", async () => {
      const delete_object = persistence.delete_object({
        model_name: "student",
        id: 1,
      });

      const expected_error = errors.not_found();
      await expect(delete_object).rejects.toEqual(expected_error);
    });
  });

  test("delete object successfully", async () => {
    const created_object = await persistence.create_object({
      model_name: "student",
      name: "mahmoud",
      age: 24,
    });

    const deleted_object = await persistence.delete_object({
      model_name: "student",
      id: created_object.id,
    });

    expect(deleted_object).toEqual(created_object);

    const fetch_object = persistence.get_object({
      model_name: "student",
      id: created_object.id,
    });

    const expected_error = errors.not_found();
    await expect(fetch_object).rejects.toEqual(expected_error);
  });
});
