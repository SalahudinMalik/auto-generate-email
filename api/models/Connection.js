/**
 * Connection.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    'address': {
      'type': 'string',
      'required': true
    },
    'router_of': {
      'type': 'string',
      'required': true
    },
    'router_brand': {
      'type': 'string',
    },
    'router_model': {
        'type': 'string',
    },
    'router_price': {
      'type': 'string',
    },
    'drop_wire_of': {
        'type': 'string',
        'required': true,
    },
    'drop_wire_length': {
        'type': 'string',
    },
    'price_per_meter': {
        'type': 'string',
    },       
    'is_wireless': {
        'type': 'boolean',
    },
    'lat': {
      'type': 'string',
    },
    'lag': {
      'type': 'string',
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
    basestation:{
      columnName: 'basestation_id',
      model:'basestation',
      required : true,
    },
    'packages': {
      'columnName': 'package_id',
      'model': 'packages',
      'required' : true,
    },
    'salesman': {
      'columnName': 'salesman_id',
      'model': 'user',
    },
    'dealer': {
      'columnName': 'dealer_id',
      'model': 'user',
    },
    // Association
    connRenewal: {
      collection: 'connRenewal',
      via: 'connection'
    },
  },

};

