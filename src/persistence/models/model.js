/**
 * @typedef FieldConfig
 * @property {string} type
 * @property {import('@/persistence/validators').IValidator[]} validators
 * @property {boolean} index
 *
 * @typedef ModelConfig
 * @property {("db"|"cache")[]} persistence_level
 */

/**
 * @typedef IModel
 * @property {ModelConfig} config
 * @property {{[x: string]: FieldConfig}} fields
 */

// if relations and searching is implemented
//  * @property {Object.<string, {type: string}>} relations
//  * @property {[keyof T]} sortable_fields
//  * @property {{ filters: [keyof T] }} search
