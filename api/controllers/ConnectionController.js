/**
 * ConnectionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    create:function(req,res){       

    if (!req.param('address') || !_.isString(req.param('address'))) {
      return res.badRequest("address required");
    }
    if (!req.param('is_wireless')) {
      return res.badRequest("is_wireless required");
    }
    if (!req.param('router_of')) {
      return res.badRequest("router_of required");
    }
    if (!req.param('drop_wire_of')) {
      return res.badRequest("drop_wire_of required");
    }
    if (!req.param('customer_id')) {
      return res.badRequest("customer_id required");
    }
    if (!req.param('basestation_id')) {
      return res.badRequest("basestation_id required");
    }
    if (!req.param('package_id')) {
      return res.badRequest("package_id required");
    }
    const process = async () => {

      const newConnection = await Connection.create({
        'address': req.param('address'),
        'router_of': req.param('router_of'),
        'router_brand': req.param('router_brand'),
        'router_model': req.param('router_model'),
        'router_price': req.param('router_price'),
        'drop_wire_of': req.param('drop_wire_of'),
        'drop_wire_length': req.param('drop_wire_length'),
        'price_per_meter': req.param('price_per_meter'),
        'is_wireless': req.param('is_wireless'),
        'lat': req.param('lat'),
        'lag': req.param('lag'),
        'customers': req.param('customer_id'),
        'packages': req.param('package_id'),
        'basestation': req.param('basestation_id'),
        'salesman': req.param('salesman_id'),
        'dealer': req.param('dealer_id'),
        'status_id': Status.ACTIVE,    
      }).fetch();
     
      if (newConnection)
        return newConnection;

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
          sort: 'router_price',
          query: ''
        });
  
      var sortable = ['router_price'];
  
      var filters = params.filters;
  
      if (!filters || !_.isArray(filters)) {
        filters = [];
      }
  
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
        where: {status_id :{'!': Status.DELETED} },
        limit: parseInt(params.per_page),
        sort: '',
      };
      if (params.sort && _.indexOf(sortable, params.sort) > -1) {
        queryObject.sort = params.sort + ' ' + params.sort_dir;
      }
      queryObject.where.or = [{
        'router_price': {
          'like': '%' + params.query + '%'
        }
      }];
  
  
     
  
      const getConnection = async() => {
  
        const Connection_count = await Connection.count({where: {status_id :{'!': Status.DELETED} }});
        if (!Connection_count){
          return new CustomError('connection not found', {
            status: 403
          });
        }
        let connection = await Connection.find(queryObject).populate('customers').populate('basestation').populate('packages')
            .populate('salesman').populate('dealer') ;
        if (!connection){
            return new CustomError('connection not found', {
              status: 403
            });
        }
        const responseObject = {
            connection: connection,
          totalCount: Connection_count,
          perPage: params.per_page,
          currentPage: params.page
        };
        return responseObject;
      }
  
      getConnection()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
    },
    findOne: function (req, res) {

      if (!(req.param('id')) || isNaN(req.param('id')))
        return res.badRequest('Not a valid request');
      let ConnectionId = req.param('id');
      let queryObject = {
        where: {id: ConnectionId , status_id :{'!': Status.DELETED} }
      };
      const getConnection = async() => {
        let connection = await Connection.findOne(queryObject).populate('customers')
        .populate('basestation').populate('packages')
        .populate('salesman').populate('dealer');
  
        if (connection)
          return connection;
        else
          return new CustomError('Connection not found', {
            status: 403
          });
  
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
      }
  
      getConnection()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    update: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
      let ConnectionId = req.param('id');
  
      const updateConnection = async() => {
  
        const oldConnection = await Connection.count({
          id: ConnectionId
        });
  
        if (oldConnection < 1) {
          return new CustomError('Invalid Connection  Id', {
            status: 403
          });
        }
  
        let connection = {};
        if (req.param('address') != undefined && _.isString(req.param('address'))) {
          connection.address = req.param('address');
        }
        if (req.param('router_of') != undefined && _.isString(req.param('router_of'))) {
          connection.router_of = req.param('router_of');
        }
        if (req.param('router_brand') != undefined && _.isString(req.param('router_brand'))) {
          connection.router_brand = req.param('router_brand');
        }
        if (req.param('router_model') != undefined && _.isString(req.param('router_model'))) {
          connection.router_model = req.param('router_model');
        }
        if (req.param('router_price') != undefined && _.isString(req.param('router_price'))) {
          connection.router_price = req.param('router_price');
        }
        if (req.param('drop_wire_of') != undefined && _.isString(req.param('drop_wire_of'))) {
          connection.drop_wire_of = req.param('drop_wire_of');
        }
        if (req.param('price_per_meter') != undefined && _.isString(req.param('price_per_meter'))) {
          connection.price_per_meter = req.param('price_per_meter');
        }
        console.log(req.param('is_wireless'));
        if (req.param('is_wireless') != undefined && _.isBoolean(req.param('is_wireless'))) {
          connection.is_wireless = req.param('is_wireless');
        }
        if (req.param('lat') != undefined && _.isString(req.param('lat'))) {
          connection.lat = req.param('lat');
        }
        if (req.param('lag') != undefined && _.isString(req.param('lag'))) {
          connection.lag = req.param('lag');
        }
        if (req.param('basestation_id') != undefined && _.isNumber(req.param('basestation_id'))) {
          connection.basestation = req.param('basestation_id');
        }
        if (req.param('package_id') != undefined && _.isNumber(req.param('package_id'))) {
          connection.packages = req.param('package_id');
        }
        if (req.param('salesman_id') != undefined && _.isNumber(req.param('salesman_id'))) {
          connection.salesman = req.param('salesman_id');
        }
        if (req.param('dealer_id') != undefined && _.isNumber(req.param('dealer_id'))) {
          connection.dealer = req.param('dealer_id');
        }
        if (req.param('customer_id') != undefined && _.isNumber(req.param('customer_id'))) {
          connection.customers = req.param('customer_id');
        }
        if (req.param('status_id') != undefined && _.isNumber(req.param('status_id'))) {
          connection.status_id = req.param('status_id');
        }
  
        const updatedConnection = await Connection.update({
          id: ConnectionId
        }, connection).fetch();
  
        if (updatedConnection)
          return updatedConnection;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      updateConnection()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    delete: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
  
      let ConnectionId = req.param('id');
      let queryObject = {
        where: {id: ConnectionId , status_id :{'!': Status.DELETED} }
      };
      const deleteConnection = async() => {
  
        const checkConnection = await Connection.count(queryObject);
  
        if (checkConnection < 1) {
          return new CustomError('Invalid Connection Id', {
            status: 403
          });
        }
  
  
        const deletedConnection = await Connection.update({
          id: ConnectionId
        }, {
          status_id: Status.DELETED
        }).fetch();
  
        if (deletedConnection)
          return deletedConnection;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      deleteConnection()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
  
  
    }
};