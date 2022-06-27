/**
 * @typedef {Object} IResumeDriver
 * @property {BuildResume} build
 *
 * Builds Resume
 * @callback BuildResume
 * @param {import('@/workers/resume_builder/templates').ResumeTemplates} template
 * @param {Object} data
 * @returns {Promise<void>}
 *
 *
 * Create Resume builder driver
 * @param {IConfig} config
 * @returns {IResumeDriver}
 */

import html_to_pdf from "html-pdf-node";
import logger from "@/logger";
import errors from "@/errors";
import { templates } from "@/workers/resume_builder/templates";

async function build({ template, data }) {
  logger.info("get resume parser");
  const template_parser = templates[template];
  if (!template_parser) {
    throw errors.invalid_template();
  }
  const html = template_parser(data);
  logger.info("template parsed correctly");

  logger.info("generate pdf from template");
  return html_to_pdf.generatePdf(
    {
      content: html,
    },
    {}
  );
}

export default build;
