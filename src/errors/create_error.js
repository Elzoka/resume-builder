/**
 * @typedef {Object} IAPIError
 * @property {true} api_error
 * @property {number} status_code
 * @property {string} [message] Added by the error handler middleware later
 * @property {string} code
 * @property {any} [data]
 * @property {import("tracing").TracingContext} ctx
 *
 * @callback ErrorFactory
 * @param {any} [data]
 * @returns {IAPIError}
 *
 */

/**
 *
 * Create an error object
 * @param {number} status_code
 * @param {string} code
 * @returns {ErrorFactory}
 */
export default function create_error(status_code, code) {
  return (data) => ({
    api_error: true,
    status_code,
    message: code,
    code,
    data,
  });
}
