/**
 * Documents.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    'file_name': {
      'type': 'string',
      'required': true,
    },
    'file_path': {
      'type': 'string',
      'required': true,
    },
    'status_id': {
      'type': 'number',
      // 'required': true,
      'defaultsTo': 1
    },
    // association 
    'customers': {
      'columnName': 'customer_id',
      'model': 'customers',
      'required': true
    },
  

  },

};

