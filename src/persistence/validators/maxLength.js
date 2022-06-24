import _ from "lodash";

/**
 * @param {number} max
 */
export default (max) => {
  return function maxLength(val) {
    return _.size(val) <= max;
  };
};
