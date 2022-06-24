/**
 * @callback IValidator
 * @param {any} val
 * @return {boolean}
 */

import maxLength from "./maxLength";
import minLength from "./minLength";
import number from "./number";
import required from "./required";
import string from "./string";
import email from "./email";
import date from "./date";
import array from "./array";
import _ from "lodash";

const type_validators = {
  string,
  number,
  date,
  array,
};

export function runFieldsValidators(
  model_config,
  body,
  ignore_required = false,
  field_keys = _.keys(model_config.fields)
) {
  // console.log(validators);
  // only validate keys in the body
  let to_be_validated_keys = _.intersection(_.keys(body), field_keys);
  // enforce adding required keys
  const required_keys = _.filter(_.keys(model_config.fields), (field_key) => {
    const field = model_config.fields[field_key];

    return field.validators?.find((v) => v.name === "required");
  });

  const invalid_fields = [];

  if (!ignore_required) {
    to_be_validated_keys = _.uniq([...required_keys, ...to_be_validated_keys]);
  }

  let fields_valid = true;
  to_be_validated_keys.forEach((field_key) => {
    const field = model_config.fields[field_key];

    const [type, subtype] = field.type.split(":");

    const type_validator = type_validators[type]();
    const is_valid_type = type_validator(
      body[field_key],
      subtype,
      field.schema
    );

    if (!is_valid_type) {
      invalid_fields.push({ field_key, validator_name: type_validator.name });
    }

    fields_valid = is_valid_type && fields_valid;

    return field.validators?.forEach((validator) => {
      const field_valid = validator(body[field_key]);

      if (!field_valid) {
        invalid_fields.push({ field_key, validator_name: validator.name });
      }

      fields_valid = fields_valid && field_valid;
    });
  });

  return {
    valid: fields_valid,
    invalid_fields,
  };
}

export default {
  maxLength,
  minLength,
  required,
  email,
  _types: type_validators,
};
