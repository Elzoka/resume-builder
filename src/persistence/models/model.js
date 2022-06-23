/**
 * @typedef FieldConfig
 * @property {string} type
 * @property {boolean} index
 *
 * @typedef ModelConfig
 * @property {("db"|"cache")[]} persistence_level
 */

/**
 * @template [T]
 * @typedef IModel
 * @property {ModelConfig} config
 * @property {{[x in keyof T]: FieldConfig}} fields
 */

// if relations and searching is implemented
//  * @property {Object.<string, {type: string}>} relations
//  * @property {[keyof T]} sortable_fields
//  * @property {{ filters: [keyof T] }} search
