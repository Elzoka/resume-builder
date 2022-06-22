/**
 * @typedef Resume
 * @property {string} first_name
 *
 */

/**
 *
 * @type {IModel<Resume>}
 */
const resume = {
  config: {
    // timestamps: true,
    // persistence_level: ['cache', 'db']
  },
  fields: {
    first_name: {
      type: "string",
      // validators: [validators.minLength(20), validators.maxLength(50)]
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
