import _ from "lodash";

/**
 * @param {number} min
 */
export default (min) => {
  return function minLength(val) {
    return _.size(val) >= min;
  };
};
