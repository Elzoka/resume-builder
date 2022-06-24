import Router from "@koa/router";
import spec from "@/docs";
import { koaSwagger } from "koa2-swagger-ui";
import model_router from "./model";
import auth_router from "./auth";
import auth_middleware from "@/middlewares/auth_middleware";

const router = new Router();

/**
 * @openapi
 * /healthcheck:
 *   get:
 *     description: health check
 *     responses:
 *       200:
 *         description: Returns a status of 200.
 */
router.get("/healthcheck", (ctx) => {
  ctx.response.status = 200;
});

/**
 * @openapi
 * /docs:
 *   get:
 *     description: Swagger docs
 *     responses:
 *       200:
 *         description: Returns UI for swagger docs.
 */
router.get(
  "/docs",
  koaSwagger({ routePrefix: false, swaggerOptions: { spec } })
);

// note: when you add a new routes, leave model routers last
router.use("/api/auth", auth_router.routes());
router.use("/api", auth_middleware, model_router.routes());

export default router;
