/**
 * Customers.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    'first_name': {
        'type': 'string',
        'required': true
    },
    'last_name': {
        'type': 'string',
        'required': true
    },
    'email': {
        'type': 'string',
        //'required': true,
        //'unique': true
    },
    'password': {
        'type': 'string',
        'required': true
    },
    'mobile': {
        'type': 'string',
        'required': true,
        'unique': true
    },       
    'cnic': {
        'type': 'string',
        'required': true,
        'unique': true
    },
    'status_id': {
      'type': 'number',
      // 'required': true,
      'defaultsTo': 1
    },
    // Association
    documents: {
      collection: 'documents',
      via: 'customers'
    },
    connection: {
      collection: 'connection',
      via: 'customers'
    },
    
  },

};

