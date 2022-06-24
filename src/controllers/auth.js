import Router from "@koa/router";
import { system_auth } from "@/components";

const auth_router = new Router();

/**
 * @openapi
 * /api/auth/login_as_guest:
 *   get:
 *     tags:
 *       - Authentication
 *     description: Create a new session for a guest user
 *     summary: login as guest
 *     responses:
 *       200:
 *         description: returns the requested resource
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *
 */
auth_router.get("/login_as_guest", async (ctx) => {
  const response = await system_auth.login_as_guest();

  ctx.response.status = 200;
  ctx.type = "application/json";
  ctx.response.body = response;
});

export default auth_router;
