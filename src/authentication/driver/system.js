import logger from "@/logger";
import id_generator from "@/persistence/utils/id_generator";
import jwt from "jsonwebtoken";

/**
 *
 * @param {import('@/config').IConfig} config
 * @returns {import("@/authentication").IAuthDriver}
 */
export default function create_client(config) {
  return {
    login: async () => {},
    register: async () => {},
    refresh_token: async () => {},

    login_as_guest: async () => {
      const user_id = id_generator();
      // TODO: maybe add expiration date later and refresh token

      const token = jwt.sign(
        { id: user_id, role: "guest", iss: "system" },
        config.system_auth_token_secret
      );

      logger.info("signed token");
      return { token };
    },

    validate_token: async (token) => {
      try {
        const resolved_token = jwt.verify(
          token,
          config.system_auth_token_secret
        );
        logger.info("token verified");
        return resolved_token;
      } catch (e) {
        logger.error("invalid token", e);
        return false;
      }
    },
  };
}
