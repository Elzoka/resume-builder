import { Server } from "http";
import Koa from "koa";
import error_handler from "@/middlewares/error_handler";
import controllers from "@/controllers";

// App
const app = new Koa();

// routes
app.use(controllers.routes());

// error handler
app.use(error_handler);

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
