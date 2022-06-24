import errors from "@/errors";
import _ from "lodash";
import maxLength from "./maxLength";
import minLength from "./minLength";
import number from "./number";
import required from "./required";
import string from "./string";

/**
 * @callback IValidator
 * @param {any} val
 * @return {boolean}
 */

/**
 *
 * @param {IModel} model_config
 * @param {{[x: string]: any}} body
 * @param {boolean} [ignore_required]
 * @param {string[]} [fields]
 */
export const runFieldsValidators = (
  model_config,
  body,
  ignore_required = false,
  field_keys = _.keys(model_config.fields)
) => {
  // only validate keys in the body
  let to_be_validated_keys = _.intersection(_.keys(body), field_keys);

  // enforce adding required keys
  const required_keys = _.filter(_.keys(model_config.fields), (field_key) => {
    const field = model_config.fields[field_key];

    return !field.validators?.includes(required);
  });

  const invalid_fields = [];

  if (!ignore_required) {
    to_be_validated_keys = _.uniq([...required_keys, ...to_be_validated_keys]);
  }

  let fields_valid = true;
  to_be_validated_keys.forEach((field_key) => {
    const field = model_config.fields[field_key];

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
};

export default {
  maxLength,
  minLength,
  string,
  number,
  required,
};
