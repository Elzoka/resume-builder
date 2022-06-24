/**
 * @typedef Resume
 * @property {string} first_name
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
      validators: [validators.maxLength(50)],
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
