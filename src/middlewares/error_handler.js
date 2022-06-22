import Koa from "koa";
import logger from "@/logger";
import errors from "@/errors";
import error_messages from "@/errors/error_messages.json";

/**
 * Identify which locale the user is requesting
 * @param {import("errors/create_error").IAPIError} err
 * @param {express.Request} req
 * @returns {import("errors/create_error").IAPIError}
 */
function serialize_error(error) {
  return {
    ...error,
    message: error_messages[error.code],
  };
}

/**
 * Catch all uncaught errors
 * @param {Error} err
 * @returns {Promise<void>}
 */
function log_uncaught_error(error) {
  logger.error("An unknown error occurred", error);
}

/**
 * @type {Koa.Middleware}
 */
export default async function error_handler(ctx, next) {
  try {
    await next();
  } catch (err) {
    // send response
    if (err.api_error) {
      logger.error("An unknown API error occurred", err);

      // ctx.response,
      ctx.response.status = err.status_code;
      ctx.body = serialize_error(err);

      return;
    }

    log_uncaught_error(err);

    ctx.response.status = errors.unknown_error().status_code;
    ctx.body = serialize_error(errors.unknown_error());
  }
}
