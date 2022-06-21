import { init_server } from "./app";

async function bootstrap() {
  const port = 3000;
  const server = await init_server(port);

  console.log(`running on http://localhost:${port}`);
}

bootstrap().catch((error) => {
  process.exit(1);
});
