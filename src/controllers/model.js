import Router from "@koa/router";
import { persistance } from "@/components";

const model_router = new Router({});
/**
 * @swagger
 * definitions:
 *   Resume:
 *     properties:
 *       first_name:
 *         type: string
 *
 *   APIError:
 *     properties:
 *       status_code:
 *         type: number
 *       api_error:
 *         type: string
 *       message:
 *         type: string
 *       code:
 *         type: string
 * components:
 *   securitySchemes:
 *     bearerAuth:            # arbitrary name for the security scheme
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * responses:
 *    Resolve:
 *      description: returns the requested resource
 *      content:
 *        application/json:
 *          schema:
 *            oneOf:
 *              - $ref: '#/definitions/Resume'
 *    InvalidResource:
 *      description: Indicates that the provided model_name is not a valid resource
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/definitions/APIError'
 *    NotFound:
 *      description: Entity with the specified id does not exist
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/definitions/APIError'
 *    UnAuthorized:
 *      description: Unauthorized to access this resource
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/definitions/APIError'
 *
 * parameters:
 *    Model_Name:
 *      name: model_name
 *      in: path
 *      description: name of the desired resource
 *      required: true
 *      style: simple
 *      explode: false
 *      schema:
 *        type: string
 *        enum:
 *          - resume
 *
 *    ID:
 *      name: id
 *      in: path
 *      description: id of the desired resource
 *      required: true
 *      style: simple
 *      explode: false
 *      schema:
 *        type: string
 */

/**
 * @openapi
 * /api/{model_name}/{id}:
 *   get:
 *     tags:
 *       - Model
 *     description: Find specific resource by specifying the model_name and the id
 *     summary: find modal by id
 *     security:
 *       - bearerAuth: []
 *     scheme: bearer
 *     bearerFormat: JWT
 *     parameters:
 *      - $ref: '#/parameters/Model_Name'
 *      - $ref: '#/parameters/ID'
 *     responses:
 *       200:
 *         $ref: '#/responses/Resolve'
 *       400:
 *         $ref: '#/responses/InvalidResource'
 *       404:
 *         $ref: '#/responses/NotFound'
 *       401:
 *         $ref: '#/responses/UnAuthorized'
 *
 */
model_router.get("/:model_name/:id", async (ctx) => {
  const { model_name, id } = ctx.params;

  const fetched_object = await persistance.get_object(
    { model_name, id },
    { user: ctx.user }
  );

  ctx.response.status = 200;
  ctx.type = "application/json";
  ctx.response.body = fetched_object;
});

/**
 * @openapi
 * /api/{model_name}:
 *   post:
 *     tags:
 *       - Model
 *     description: create new resource by specifying the model_name and the id
 *     summary: Create new resource
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - $ref: '#/parameters/Model_Name'
 *     requestBody:
 *      description: specify the model body
 *      content:
 *        application/json:
 *          schema:
 *            oneOf:
 *              - $ref: '#/definitions/Resume'
 *     responses:
 *       200:
 *         $ref: '#/responses/Resolve'
 *       400:
 *         $ref: '#/responses/InvalidResource'
 *       401:
 *         $ref: '#/responses/UnAuthorized'
 */
model_router.post("/:model_name", async (ctx) => {
  const { model_name } = ctx.params;
  const { body } = ctx.request;

  const created_object = await persistance.create_object(
    {
      model_name,
      ...body,
    },
    {
      user: ctx.user,
    }
  );

  ctx.response.status = 201;
  ctx.response.body = created_object;
});

/**
 * @openapi
 * /api/{model_name}/{id}:
 *   patch:
 *     tags:
 *       - Model
 *     description: update resource of the specified id
 *     summary: Patch Update resource
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - $ref: '#/parameters/Model_Name'
 *      - $ref: '#/parameters/ID'
 *     requestBody:
 *      description: specify the model body
 *      content:
 *        application/json:
 *          schema:
 *            oneOf:
 *              - $ref: '#/definitions/Resume'
 *     responses:
 *       200:
 *         $ref: '#/responses/Resolve'
 *       400:
 *         $ref: '#/responses/InvalidResource'
 *       404:
 *         $ref: '#/responses/NotFound'
 *       401:
 *         $ref: '#/responses/UnAuthorized'
 */
model_router.patch("/:model_name/:id", async (ctx) => {
  const { model_name, id } = ctx.params;
  const { body } = ctx.request;

  const updated_object = await persistance.update_object(
    {
      model_name,
      id,
      ...body,
    },
    {
      user: ctx.user,
    }
  );

  ctx.response.status = 200;
  ctx.response.body = updated_object;
});

/**
 * @openapi
 * /api/{model_name}/{id}:
 *   delete:
 *     tags:
 *       - Model
 *     description: delete the resource of the specified id
 *     summary: Delete resource
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - $ref: '#/parameters/Model_Name'
 *      - $ref: '#/parameters/ID'
 *     responses:
 *       200:
 *         $ref: '#/responses/Resolve'
 *       400:
 *         $ref: '#/responses/InvalidResource'
 *       404:
 *         $ref: '#/responses/NotFound'
 *       401:
 *         $ref: '#/responses/UnAuthorized'
 */
model_router.delete("/:model_name/:id", async (ctx) => {
  const { model_name, id } = ctx.params;

  const deleted_object = await persistance.delete_object(
    { model_name, id },
    {
      user: ctx.user,
    }
  );

  ctx.response.status = 200;
  ctx.response.body = deleted_object;
});

export default model_router;
