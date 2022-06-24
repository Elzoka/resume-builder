import dotenv from "dotenv";

/**
 *
 * Configuration object
 * @typedef {Object} IConfig
 * @property {string} host Network interface to listen on
 * @property {number} port The port the project runs on locally
 * @property {string} service The running service
 * @property {string} database The configured db
 * @property {string} redis_url redis connection string
 * @property {string} test_redis_url redis connection string for testing
 * @property {string} auth_driver authentication driver
 * @property {string} system_auth_token_secret jwt token secret
 */

dotenv.config();

/** @type {IConfig} */
const config = {};

const env_values = Object.keys(process.env).map((key) => ({
  key: key.toLowerCase(),
  value: process.env[key],
}));

const prefix = "api_";
const explicit_env_vars = ["npm_package_version"];

env_values
  .filter(
    ({ key }) => key.startsWith(prefix) || explicit_env_vars.includes(key)
  )
  .map(({ key, value }) => ({ key: key.replace(prefix, ""), value }))
  .forEach(({ key, value }) => (config[key] = value));

export default config;
