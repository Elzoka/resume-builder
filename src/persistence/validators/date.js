import _ from "lodash";
import moment from "moment";

export default () => {
  return function date(val) {
    return moment(val, "DDMMYYYY").isValid();
  };
};
