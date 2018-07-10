'use strict';
/**
 * CustomError
 *
 * @description :: Custom Error Handler to handle custom errors with objects which are not available in default Error class
 */

/**
 *
 * @param {string} message - error message
 * @param {object|array} [errObj] - your custom object
 * @param {string} [errorName] - custom name for error
 * @constructor
 */
function CustomError(message, errObj, errorName){
    this.name = errorName || 'Custom Error';
    this.message = message;
    if(_.isArray(errObj)){
        this.errors = errObj;
    }
    else if(typeof errObj == 'object'){
        for(let prop in errObj){
            this[prop] = errObj[prop];
        }
    }
    this.stack = (new Error()).stack;
}
CustomError.prototype = new Error;

module.exports = CustomError;
