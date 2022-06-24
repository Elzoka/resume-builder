/**
 * @typedef Resume
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} summary
 * @property {string[]} skills
 * @property {string} email
 * @property {IExperience[]} experiences
 * @property {IEducation[]} education
 *
 * @typedef IExperience
 * @property {string} company_name
 * @property {date} start_date
 * @property {date} end_date
 * @property {string} position
 * @property {string} location
 * @property {string} summary
 *
 * @typedef IEducation
 * @property {string} school_name
 * @property {date} start_date
 * @property {date} end_date
 * @property {string} study
 * @property {string} location
 * @property {string} summary
 *
 */

import validators from "../validators";

/**
 *
 * @type {IModel<Resume>}
 */
const resume = {
  config: {
    persistence_level: ["cache"],
    // timestamps: true,
    // persistence_level: ['cache', 'db']
  },
  fields: {
    first_name: {
      type: "string",
      validators: [validators.required(), validators.maxLength(50)],
    },
    last_name: {
      type: "string",
      validators: [validators.maxLength(50)],
    },
    summary: {
      type: "string",
      validators: [validators.maxLength(250)],
    },
    skills: {
      type: "array:string",
    },
    email: {
      type: "string",
      validators: [validators.email()],
    },
    experiences: {
      type: "array:object",
      schema: {
        company_name: {
          type: "string",
          validators: [validators.minLength(3), validators.maxLength(50)],
        },
        start_date: {
          type: "date",
        },
        end_date: {
          type: "date",
        },
        position: {
          type: "string",
          validators: [validators.minLength(3), validators.maxLength(50)],
        },
        location: {
          type: "string",
          validators: [validators.minLength(3), validators.maxLength(50)],
        },
        summary: {
          type: "string",
          validators: [validators.minLength(3), validators.maxLength(250)],
        },
      },
    },
    education: {
      type: "array:object",
      schema: {
        school_name: {
          type: "string",
          validators: [validators.minLength(3), validators.maxLength(50)],
        },
        start_date: {
          type: "date",
        },
        end_date: {
          type: "date",
        },
        study: {
          type: "string",
          validators: [validators.minLength(3), validators.maxLength(50)],
        },
        location: {
          type: "string",
          validators: [validators.minLength(3), validators.maxLength(50)],
        },
        summary: {
          type: "string",
          validators: [validators.minLength(3), validators.maxLength(250)],
        },
      },
    },
  },
  // relations: {
  //   courses: {
  //     type: "object:course",
  //   },
  // },
  // sortable_fields: [],
  // search: {
  //   filters: [],
  // },
};

export default resume;
