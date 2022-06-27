import path from "path";

import logger from "@/logger";
import { Piscina } from "piscina";
import resume_builder from "@/workers/resume_builder";

/**
 * Build Resume
 * @param {import('@/config').IConfig} config
 * @returns {import('@/workers/resume_builder/index.mjs').IResumeDriver}
 */
export default function create_client(config) {
  logger.info("creating resume builder driver");

  function register_worker(worker_name) {
    logger.info(`register worker ${worker_name}`);
    const piscina = new Piscina({
      filename: path.resolve(__dirname, `./${worker_name}/index.js`),
    });

    return async (args) => {
      logger.info(`calling ${worker_name}`);
      const result = await piscina.run(args);
      return Buffer.from(result);
    };
  }

  // register workers
  return {
    resume_builder:
      process.env.NODE_ENV === "dev"
        ? resume_builder
        : register_worker("resume_builder"),
  };
}
