import { system_auth } from "@/components";
import errors from "@/errors";
import logger from "@/logger";
import Koa from "koa";

/**
 * @type {Koa.Middleware}
 */
export default async function auth_middleware(ctx, next) {
  logger.info("check authentication");

  logger.info("check authentication header exists");
  const auth_header = ctx.header.authorization;

  if (!auth_header) {
    throw errors.token_required();
  }

  logger.info("extract token");
  const [, token] = auth_header.split("Bearer ");

  logger.info("validate token");

  const resolved_token = await system_auth.validate_token(token);

  if (!resolved_token) {
    throw errors.invalid_token();
  }

  ctx.user = {
    id: resolved_token.id,
    role: resolved_token.role,
  };

  logger.info("token is valid with author", ctx.user);

  await next();
}
