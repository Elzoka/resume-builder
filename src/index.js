import { init_server } from "@/app";
import config from "@/config";

async function bootstrap() {
  const { port, host } = config;
  const server = await init_server(port);

  console.log(`running on http://${host}:${port}`);
}

bootstrap().catch((error) => {
  process.exit(1);
});
