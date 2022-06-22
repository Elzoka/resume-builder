import { init_server } from "@/app";
import config from "@/config";
import logger from "@/logger";

async function bootstrap() {
  const { port, host } = config;
  const server = await init_server(port);

  logger.info(`running on http://${host}:${port}`);

  server.on("close", (err) => {
    logger.error("unknown error", err);
  });
}

bootstrap().catch((error) => {
  logger.error("error while bootstrapping the server", error);
  process.exit(1);
});
