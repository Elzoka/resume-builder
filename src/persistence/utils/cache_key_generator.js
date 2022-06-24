/**
 *
 * @param {string} model_name
 * @param {string} id
 * @param {string} [user_id]
 * @returns {string}
 */
export default function cache_key_generator(model_name, id, user_id) {
  if (user_id) {
    return `${model_name}:${user_id}:${id}`;
  }
  return `${model_name}:${id}`;
}
