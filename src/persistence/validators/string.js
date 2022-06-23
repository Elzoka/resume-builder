import _ from "lodash";

export default () => {
  return function string(val) {
    return _.isString(val);
  };
};
