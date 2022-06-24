import { Server } from "http";
import Koa from "koa";
import error_handler from "@/middlewares/error_handler";
import koa_body_parser from "koa-bodyparser";
import controllers from "@/controllers";
import "@/components";
import request_logger from "./middlewares/request_logger";

// App
const app = new Koa();

// error handler
app.use(error_handler);

// middle_wares
app.use(koa_body_parser());
app.use(request_logger);

// routes
app.use(controllers.routes());

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
