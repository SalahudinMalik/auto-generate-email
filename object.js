
base url:  http://localhost:1337

// for UserController

  'POST /user/create': 'UserController.create',
  'POST /user/findOne': 'UserController.findOne',
  'GET /user/find': 'UserController.find',
  'POST /user/update': 'UserController.Update',
  'DELETE /user/delete': 'UserController.delete',
  'POST /user/login': 'UserController.login',


userobj
{
     "first_name":"",
     "last_name": "",
     "mobile": "",
     "password": "",
     "role_type": ""
}

  // for CustomersController

  'POST /customer/create': 'CustomersController.create',
  'GET /customer/find': 'CustomersController.find',
  'POST /customer/findOne': 'CustomersController.findOne',
  'POST /customer/update': 'CustomersController.Update',
  'DELETE /customer/delete': 'CustomersController.delete',
  'POST /customer/login': 'CustomersController.login',
customerobj
{
     "first_name":"",
     "last_name": "",
     "mobile": "",
     "password": "",
     "cnic": "",
     "email": ""
}
  // for DocumentsController

   'POST /documents/create': 'DocumentsController.create',
   'GET /documents/find': 'DocumentsController.find',
   'POST /documents/findOne': 'DocumentsController.findOne',
   'POST /documents/update': 'DocumentsController.Update',
   'DELETE /documents/delete': 'DocumentsController.delete',
documentobj
{
     "file_name":"",
     "file_path": "",
     "customer_id": ""
}
// for  BasestationController

  'POST /basestation/create': 'BasestationController.create',
  'GET /basestation/find': 'BasestationController.find',
  'POST /basestation/findOne': 'BasestationController.findOne',
  'POST /basestation/update': 'BasestationController.Update',
  'DELETE /basestation/delete': 'BasestationController.delete',
basestationobj
{
     "name":"",
     "address": "",
     "lat": "",
     "lag": "",
     "bandwidth": "",
     "max_connection": ""
}
// for  ConnectionController

'POST /connection/create': 'ConnectionController.create',
'GET /connection/find': 'ConnectionController.find',
'POST /connection/findOne': 'ConnectionController.findOne',
'POST /connection/update': 'ConnectionController.Update',
'DELETE /connection/delete': 'ConnectionController.delete',
connectionobj
{
     "address":"",
     "router_price": "",
     "drop_wire": "",
     "wire_length": "",
     "price_per_meter": "",
     "is_wireless": "",
     "lat": "",
     "lag": "",
     "customer_id": "",
     "basestation_id": "",
     "salesman_id": "",
     "dealer_id": "",
}
// for  PackagesController

'POST /package/create': 'PackagesController.create',
'GET /package/find': 'PackagesController.find',
'POST /package/findOne': 'PackagesController.findOne',
'POST /package/update': 'PackagesController.Update',
'DELETE /package/delete': 'PackagesController.delete',
packageobj
{
     "package_name":""
}