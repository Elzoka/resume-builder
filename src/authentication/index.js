import { IConfig } from "@/config";
import logger from "@/logger";
import system from "@/authentication/driver/system";

/**
 * @typedef {Object} IAuthDriver
 * @property {IRegisterUser} register
 * @property {ILoginUser} login
 * @property {IValidateUserToken} validate_token
 * @property {ILoginAsGuest} login_as_guest
 *
 *
 * @callback IRegisterUser
 * @returns {Promise<void>}
 *
 * @typedef ILoginResponse
 * @property {string} token
 *
 * @callback ILoginUser
 * @param {{ username?: string, password?: string, role?:string }} params
 * @returns {Promise<ILoginResponse>}
 *
 * @callback ILoginAsGuest
 * @returns {Promise<ILoginResponse>}
 *
 * @typedef {Object} IValidateTokenResponse
 * @property {string} [id]
 * @property {string} [role]
 *
 *
 * @callback IValidateUserToken
 * @param {string} token
 * @returns {Promise<IValidateTokenResponse>}
 *
 * Initialize authentication driver
 * @param {IConfig} config
 * @returns {IAuthDriver}
 */
export default function create_client(config) {
  logger.info("initializing authentication driver");

  /** @type {IAuthDriver} */
  let driver;

  if (config.auth_driver === "system") {
    driver = system(config);
  } else {
    logger.error("authentication driver not selected");
    process.exit();
  }

  return driver;
}
