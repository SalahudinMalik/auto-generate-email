/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

 // for UserController

  'POST /user/create': 'UserController.create',                           
  'GET /user/findOne/:id': 'UserController.findOne',
  'GET /user/find': 'UserController.find',
  'POST /user/update': 'UserController.update',
  'DELETE /user/delete': 'UserController.delete',
  'POST /user/login': 'UserController.login',

  // for CustomersController

  'POST /customer/create': 'CustomersController.create',
  'GET /customer/find': 'CustomersController.find',
  'GET /customer/findOne/:id': 'CustomersController.findOne',
  'POST /customer/update': 'CustomersController.update',
  'DELETE /customer/delete': 'CustomersController.delete',
  'POST /customer/login': 'CustomersController.login',

  // for DocumentsController

   'POST /documents/create': 'DocumentsController.create',
   'GET /documents/find': 'DocumentsController.find',
   'GET /documents/findOne/:id': 'DocumentsController.findOne',
   'POST /documents/update': 'DocumentsController.update',
   'DELETE /documents/delete': 'DocumentsController.delete',

// for  BasestationController

  'POST /basestation/create': 'BasestationController.create',
  'GET /basestation/find': 'BasestationController.find',
  'GET /basestation/findOne/:id': 'BasestationController.findOne',
  'POST /basestation/update': 'BasestationController.update',
  'DELETE /basestation/delete': 'BasestationController.delete',

// for  ConnectionController

'POST /connection/create': 'ConnectionController.create',
'GET /connection/find': 'ConnectionController.find',
'GET /connection/findOne/:id': 'ConnectionController.findOne',
'POST /connection/update': 'ConnectionController.update',
'DELETE /connection/delete': 'ConnectionController.delete',

// for  PackagesController

'POST /package/create': 'PackagesController.create',
'GET /package/find': 'PackagesController.find',
'GET /package/findOne/:id': 'PackagesController.findOne',
'POST /package/update': 'PackagesController.update',
'DELETE /package/delete': 'PackagesController.delete',

// for  ConnRenewalController

'POST /connrenewal/create': 'ConnRenewalController.create',
'GET /connrenewal/find': 'ConnRenewalController.find',
'GET /connrenewal/findOne/:id': 'ConnRenewalController.findOne',
'POST /connrenewal/update': 'ConnRenewalController.update',
'DELETE /connrenewal/delete': 'ConnRenewalController.delete',


// for  UsersRoutesController

'POST /usersroutes/create': 'UsersRoutesController.create',
'GET /usersroutes/find': 'UsersRoutesController.find',
'GET /usersroutes/findOne/:id': 'UsersRoutesController.findOne',
'POST /usersroutes/update': 'UsersRoutesController.update',
'DELETE /usersroutes/delete': 'UsersRoutesController.delete',

// for  RoutesController

'POST /routes/create': 'RoutesController.create',
'GET /routes/find': 'RoutesController.find',
'GET /routes/findOne/:id': 'RoutesController.findOne',
'POST /routes/update': 'RoutesController.update',
'DELETE /routes/delete': 'RoutesController.delete',

// for  RolesRoutesController

'POST /rolesroutes/create': 'RolesRoutesController.create',
'GET /rolesroutes/find': 'RolesRoutesController.find',
'GET /rolesroutes/findOne/:id': 'RolesRoutesController.findOne',
'POST /rolesroutes/update': 'RolesRoutesController.update',
'DELETE /rolesroutes/delete': 'RolesRoutesController.delete',

// for  RolesController

'POST /roles/create': 'RolesController.create',
'GET /roles/find': 'RolesController.find',
'GET /roles/findOne/:id': 'RolesController.findOne',
'POST /roles/update': 'RolesController.update',
'DELETE /roles/delete': 'RolesController.delete',

// for  ExpirationReportController

'GET /expreport/find/:days_difference': 'ExpirationReportController.find',

// for  NotifyController

'POST /notify/create': 'NotifyController.create',
'POST /notify/stop': 'NotifyController.stop',
// 'GET /roles/findOne/:id': 'RolesController.findOne',
// 'POST /roles/update': 'RolesController.update',
// 'DELETE /roles/delete': 'RolesController.delete',
  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝



  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
