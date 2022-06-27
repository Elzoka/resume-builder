import handlebars from "handlebars";
import fs from "fs";
import path from "path";

/**
 * @typedef {'resume1'} ResumeTemplates
 */
export const templates_keys = ["resume1", "resume2"];

/**
 * Render html based on template
 * @callback CompiledTemplate
 * @param {Object} data
 * @returns {string}
 */

/** @type {Object.<ResumeTemplates,CompiledTemplate>} */
export const templates = {};

/**
 * Read template and compile it
 * @param {string} file_path
 * @returns {HandlebarsTemplateDelegate<any>}
 */
function compile_template(file_path) {
  return handlebars.compile(
    fs.readFileSync(path.join(process.cwd(), `./src/${file_path}`), "ascii")
  );
}

templates_keys.forEach((template_key) => {
  templates[template_key] = compile_template(
    `workers/resume_builder/templates/${template_key}.hbs`
  );
});
