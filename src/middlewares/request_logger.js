import logger from "@/logger";
import Koa from "koa";

/**
 * @type {Koa.Middleware}
 */
export default async function request_logger(ctx, next) {
  logger.info(`${ctx.request.method} ${ctx.request.path}`);

  await next();
}
