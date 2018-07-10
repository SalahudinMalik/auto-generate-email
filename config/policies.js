/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  // '*': ['isAdmin' , 'isAuth'],
  '*': ['isAuth'],
  UserController:{
    'create':true,
    'login':true    
  },
  RoutesController:{
    'create':true,   
  },
  RolesRoutesController:{
    'create':true,  
  },
  RolesController:{
    'create':true,  
  },
  UsersRoutesController:{
    'create':true,  
  },
  ExpirationReportController:{
    'find':true,
  }
  // ConnRenewalController:{
  //   'create':true,  
  // }
};
