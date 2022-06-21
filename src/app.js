import { Server } from "http";
import Koa from "koa";
import Router from "@koa/router";

// App
const app = new Koa();

// routes
const router = new Router();
router.get("/healthcheck", (ctx) => {
  ctx.response.status = 200;
});

app.use(router.routes());

/**
 *
 * @param {number} port
 * @returns {Server}
 */
export function init_server(port) {
  if (!port) {
    throw new Error(`invalid server port ${port}`);
  }

  return new Promise((resolve) => {
    const server = app.listen(port, () => resolve(server));
  });
}

export default app;
