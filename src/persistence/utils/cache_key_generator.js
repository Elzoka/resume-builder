/**
 *
 * @param {string} model_name
 * @param {string} id
 * @returns {string}
 */
export default function cache_key_generator(model_name, id) {
  return `${model_name}:${id}`;
}
