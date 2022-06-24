import _ from "lodash";

export default () => {
  return function email(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };
};
