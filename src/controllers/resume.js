import Router from "@koa/router";
import { persistance, workers } from "@/components";
import logger from "@/logger";
import errors from "@/errors";

const resume_router = new Router();
/**
 * @openapi
 * /api/resume/{id}/download:
 *   post:
 *     tags:
 *       - Resume
 *     description: Download resume as pdf
 *     summary: Request to generate a pdf version from the data
 *     parameters:
 *      - $ref: '#/parameters/ID'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      description: specify the model body
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              template:
 *                type: string
 *                enum:
 *                 - resume1
 *                 - resume2
 *     responses:
 *       200:
 *         description: return a stream
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *
 */
resume_router.post("/:id/download", async (ctx) => {
  logger.info("fetching resume");
  // this will throw if element does not exist
  const resume = await persistance.get_object(
    {
      model_name: "resume",
      id: ctx.params.id,
    },
    { user: ctx.user }
  );

  const template = ctx.request.body?.template;

  if (!template) {
    throw errors.template_required();
  }

  logger.info(`build resume for ${resume.id} with template ${template}`);
  // you can use template one but template is not formatted well
  const resume_buffer = await workers.resume_builder({
    template,
    data: resume,
  });

  logger.info("compiled successfully");

  ctx.attachment(`${resume.first_name}s_resume.pdf`);
  ctx.response.status = 200;
  ctx.response.body = resume_buffer;
});

export default resume_router;
