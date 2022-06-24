import system_auth_lib from "@/authentication/driver/system";
import config from "@/config";
import jwt from "jsonwebtoken";

describe("authentication", () => {
  /**
   * @type {import('@/authentication').IAuthDriver}
   */
  let system_auth;
  beforeAll(() => {
    system_auth = system_auth_lib(config);
  });

  describe("login_as_guest", () => {
    test("should a valid jwt token", async () => {
      const { token } = await system_auth.login_as_guest();

      expect(token).toBeTruthy();

      const result = jwt.verify(token, config.system_auth_token_secret);

      expect(result).toEqual(expect.objectContaining({ role: "guest" }));
      expect(result.id).toBeTruthy();
    });
  });

  describe("validate_token", () => {
    test("should return validated token", async () => {
      const { token } = await system_auth.login_as_guest();
      const result = await system_auth.validate_token(token);

      expect(result).toEqual(expect.objectContaining({ role: "guest" }));
      expect(result.id).toBeTruthy();
    });

    test("should return false for invalid token", async () => {
      const { token } = await system_auth.login_as_guest();
      const invalid_token = token + "1";
      const result = await system_auth.validate_token(invalid_token);

      expect(result).toBe(false);
    });
  });
});
