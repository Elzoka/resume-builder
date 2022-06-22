/**
 * @typedef FieldConfig
 * @property {string} type
 * @property {boolean} index
 */

/**
 * @template [T]
 * @typedef IModel
 * @property {{[x in keyof T]: FieldConfig}} fields
 */

// if relations and searching is implemented
//  * @property {Object.<string, {type: string}>} relations
//  * @property {[keyof T]} sortable_fields
//  * @property {{ filters: [keyof T] }} search
