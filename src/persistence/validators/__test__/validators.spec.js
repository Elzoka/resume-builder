import validators, { runFieldsValidators } from "@/persistence/validators";

describe("validators", () => {
  describe("maxLength", () => {
    test("should fail", () => {
      const is_valid = validators.maxLength(3)("abcd");

      expect(is_valid).toBe(false);
    });

    test("should pass", () => {
      const is_valid = validators.maxLength(3)("ab");

      expect(is_valid).toBe(true);
    });
  });
  describe("minLength", () => {
    test("should fail", () => {
      const is_valid = validators.minLength(3)("ab");

      expect(is_valid).toBe(false);
    });

    test("should pass", () => {
      const is_valid = validators.minLength(3)("abcd");

      expect(is_valid).toBe(true);
    });
  });

  describe("number", () => {
    test("should fail", () => {
      const is_valid = validators._types.number()("ab");

      expect(is_valid).toBe(false);
    });

    test("should pass", () => {
      const is_valid = validators._types.number()(3);

      expect(is_valid).toBe(true);
    });
  });
  describe("string", () => {
    test("should fail", () => {
      const is_valid = validators._types.string()(3);

      expect(is_valid).toBe(false);
    });

    test("should pass", () => {
      const is_valid = validators._types.string()("abcd");

      expect(is_valid).toBe(true);
    });
  });
  describe("date", () => {
    test("should fail", () => {
      const is_valid = validators._types.date()("abcd");

      expect(is_valid).toBe(false);
    });

    test("should pass", () => {
      const is_valid = validators._types.date()("22/7/2022");

      expect(is_valid).toBe(true);
    });
  });
  describe("email", () => {
    test("should fail", () => {
      const is_valid = validators.email()("test123");

      expect(is_valid).toBe(false);
    });

    test("should pass", () => {
      const is_valid = validators.email()("test@test.com");

      expect(is_valid).toBe(true);
    });
  });
  describe("required", () => {
    test("should fail", () => {
      const is_valid = validators.required()(undefined);

      expect(is_valid).toBe(false);
    });

    test("should pass", () => {
      const is_valid = validators.required()("ab");

      expect(is_valid).toBe(true);
    });
  });

  describe("runFieldsValidators", () => {
    /**
     * @type {IModel}
     */
    const customModel = {
      fields: {
        name: {
          type: "string",
          validators: [validators.maxLength(10)],
        },
        age: {
          type: "number",
          validators: [validators.required()],
        },
      },
    };

    test("should fail required validation", () => {
      const validation_result = runFieldsValidators(customModel, {
        name: "mahmoud",
      });

      expect(validation_result.valid).toBe(false);
      expect(validation_result.invalid_fields).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            validator_name: "required",
            field_key: "age",
          }),
        ])
      );
    });

    test("should pass required validation", () => {
      const validation_result = runFieldsValidators(customModel, {
        name: "mahmoud",
        age: 24,
      });

      expect(validation_result.valid).toBe(true);
    });

    test("should fail string and number validation", () => {
      const validation_result = runFieldsValidators(customModel, {
        name: 24,
        age: "mahmoud",
      });

      expect(validation_result.valid).toBe(false);
      expect(validation_result.invalid_fields).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            validator_name: "string",
            field_key: "name",
          }),
          expect.objectContaining({
            validator_name: "number",
            field_key: "age",
          }),
        ])
      );
    });
  });
});
