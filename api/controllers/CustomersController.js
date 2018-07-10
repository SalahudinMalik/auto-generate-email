/**
 * CustomersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var _ = require('lodash'); 
module.exports = {

    create:function(req,res){       

    let password = util.string.random.number(11);

    if (!req.param('first_name') || !_.isString(req.param('first_name'))) {
      return res.badRequest("first_name required");
    }

    //make sure lastName is provided
    if (!req.param('last_name') || !_.isString(req.param('last_name'))) {

      return res.badRequest("last_name required");
    }
    // console.log(!_.isNumber(req.param('role_type')) + ' value : '+ req.param('role_type'));
    if (!req.param('cnic')) {
      return res.badRequest("cnic required");
    }

    //make sure email is provided
    if (!req.param('mobile') || !_.isString(req.param('mobile'))) {

      return res.badRequest("mobile number required");
    }

    if (req.param('password')) {
      if (!_.isString(req.param('password')))
        return res.badRequest("password is required");
      password = req.param('password');
    }

    const process = async () => {

      const checkCustomerMobile = await Customers.count({
        mobile: req.param('mobile')
      });

      if (checkCustomerMobile > 0)
        throw new CustomError('This mobile number is  already in use', {
          status: 403
        });
        const checkCustomerCnic = await Customers.count({
            cnic: req.param('cnic')
          });
    
          if (checkCustomerCnic > 0)
            throw new CustomError('This cnic number is  already in use', {
              status: 403
            });
      let encryptedPassword = await util.getEncryptedPasswordAsync(password);

      if (!encryptedPassword)
        throw new CustomError('Some error occurred. Please contact support team for help', {
          status: 403
        });
      const newCustomer = await Customers.create({
        'first_name': req.param('first_name'),
        'last_name': req.param('last_name'),
        'email': req.param('email'),
        'password': encryptedPassword,
        'mobile': req.param('mobile'),
        'cnic': req.param('cnic'),
        'status_id': Status.ACTIVE,   
      }).fetch();
     
      if (newCustomer)
        return newCustomer;

      throw new CustomError('Some error occurred. Please contact support team for help. ');
    }

    process()
      .then(res.ok)
      .catch(err => util.errorResponse(err, res));
    },
    find: function (req, res) {
      var params = req.allParams(),
        params = _.defaults(params, {
          filters: [],
          page: 1,
          per_page: 20,
          sort_dir: 'ASC',
          sort: 'first_name',
          query: ''
        });
  
      var sortable = ['first_name'];
  
      var filters = params.filters;
  
      if (!filters || !_.isArray(filters)) {
        filters = [];
      }
     // console.log(params);
      if (params.page) {
        if (!parseInt(params.page) || !_.isNumber(parseInt(params.page))) {
          return res.badRequest({
            err: 'Invalid page field value'
          });
        }
      }
      if (params.per_page) {
        if (!parseInt(params.per_page) || !_.isNumber(parseInt(params.per_page))) {
          return res.badRequest({
            err: 'Invalid per_page field value'
          });
        }
      }
      if (params.query) {
        if (!_.isString(params.query)) {
          return res.badRequest({
            err: 'Invalid search_term field value'
          });
        }
      }
      let queryObject = {
        where: {status_id :{'!=': Status.DELETED} },
        limit: parseInt(params.per_page),
        sort: '',
      };
      if (params.sort && _.indexOf(sortable, params.sort) > -1) {
        queryObject.sort = params.sort + ' ' + params.sort_dir;
      }
      queryObject.where.or = [{
        'first_name': {
          'like': '%' + params.query + '%'
        }
      }];
  
  
      const getCustomers = async() => {
        const customers_count =  await Customers.count({ where: {status_id :{'!=': Status.DELETED} }});
        if (!customers_count){
            return new CustomError('customer not found', {
              status: 403
            });
        }
        let customers = await Customers.find(queryObject);
        if (!customers){
            return new CustomError('customer not found', {
              status: 403
            });
        }
        const responseObject = {
          customers: customers,
          totalCount: customers_count,
          perPage: params.per_page,
          currentPage: params.page
        };
        return responseObject;
      }
  
      getCustomers()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
    },
    findOne: function (req, res) {

      if (!(req.param('id')) || isNaN(req.param('id')))
        return res.badRequest('Not a valid request');
      let customerId = req.param('id')
      let queryObject = {
        where: {id: customerId , status_id :{'!=': Status.DELETED} }
      };
      const getCustomer = async() => {
        let customer = await Customers.findOne(queryObject);
  
        if (customer)
          return customer;
        else
          return new CustomError('Customer not found', {
            status: 403
          });
  
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
      }
  
      getCustomer()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    login: async function (req, res) {
      if (!req.param('mobile') || !_.isString(req.param('mobile'))) {

        return res.badRequest("mobile number required");
      }
      if (req.param('password') || !_.isString(req.param('password'))) {
          return res.badRequest("password is required");

      }
  
      let queryObject = {
        where: {mobile: req.body.mobile , status_id :{'!=': Status.DELETED} }
      };
      var customersRecord = await Customers.findOne(queryObject);
    
      if(!customersRecord) {
          return res.json({error : 'customers not found'})
      }

      const process = async()=>{
          var fnResult = await encryptCheckPassword.checkPassword(req.body.password, customersRecord.password);
          if(!fnResult)
          {
             return {error: 'error'};
          }
          else if(fnResult != true){
              return fnResult;
          }
          else if(fnResult == true){
              return{
                  customers:customersRecord,
                  token: jwToken.issue({
                      customers: customersRecord.id
                    }, '1d') //generate the token and send it in the response
              };
          }
      }
      process().then(res.ok)
      .catch(err=>util.errorResponse(err,res));

    },
    update: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
      let customerId = req.param('id');
  
      const updateCustomer = async() => {
  
        const oldCustomer = await Customers.count({
          id: customerId
        });
  
        if (oldCustomer < 1) {
          return new CustomError('Invalid Customer  Id', {
            status: 403
          });
        }
  
        let customer = {};
  
        if (req.param('first_name') != undefined && _.isString(req.param('first_name'))) {
            customer.first_name = req.param('first_name');
        }
        if (req.param('last_name') != undefined && _.isString(req.param('last_name'))) {
          customer.last_name = req.param('last_name');
        }
        if (req.param('cnic') != undefined && _.isString(req.param('cnic'))) {
          customer.cnic = req.param('cnic');
        }
        if (req.param('email') != undefined && _.isString(req.param('email'))) {
          customer.email = req.param('email');
        }
        if (req.param('mobile') != undefined && _.isString(req.param('mobile'))) {
            customer.mobile = req.param('mobile');
        }
        if (req.param('status_id') != undefined && _.isNumber(req.param('status_id'))) {
            customer.status_id = req.param('status_id');
        }
  
  
        const updatedCustomer = await Customers.update({
          id: customerId
        }, customer).fetch();
  
        if (updatedCustomer)
          return updatedCustomer;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      updateCustomer()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    delete: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
  
      let customerId = req.param('id');
      let queryObject = {
        where: {id: customerId , status_id :{'!=': Status.DELETED} }
      };
      const deleteCustomer = async() => {
  
        const checkCustomer = await Customers.count(queryObject);
  
        if (checkCustomer < 1) {
          return new CustomError('Invalid customer Id', {
            status: 403
          });
        }
  
  
        const deletedCustomer = await Customers.update({
          id: customerId
        }, {
          status_id: Status.DELETED
        }).fetch();
  
        if (deletedCustomer)
          return deletedCustomer;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      deleteCustomer()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
  
  
    }
};