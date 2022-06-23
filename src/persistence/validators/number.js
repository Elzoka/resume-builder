import _ from "lodash";

export default () => {
  return function number(val) {
    return _.isNumber(val);
  };
};
