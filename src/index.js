import { init_server } from "@/app";
import config from "@/config";
import logger from "@/logger";

async function bootstrap() {
  const { port, host, docs_endpoint } = config;
  const server = await init_server(port);

  const url = `http://${host}:${port}`;
  logger.info(`running on ${url}`);
  logger.info(`check api docs on ${url}${docs_endpoint}`);

  server.on("close", (err) => {
    logger.error("unknown error", err);
  });
}

bootstrap().catch((error) => {
  logger.error("error while bootstrapping the server", error);
  process.exit(1);
});
