/**
 * ConnRenewalController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    create:function(req,res){       

    if (!req.param('renewal_date') || !_.isString(req.param('renewal_date'))) {
      return res.badRequest("renewal_date required");
    }

    //make sure lastName is provided
    if (!req.param('connection_id')) {
      return res.badRequest("connection_id required");
    } 
    
    const process = async () => {

      const newConnRenewal = await ConnRenewal.create({
        'renewal_date': req.param('renewal_date'),
        'connection': req.param('connection_id'),
        'status_id': Status.ACTIVE,
        'user':req.token.user
      }).fetch();
     
      if (newConnRenewal)
        return newConnRenewal;

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
          sort: 'renewal_date',
          query: ''
        });
  
      var sortable = ['renewal_date'];
  
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
        'renewal_date': {
          'like': '%' + params.query + '%'
        }
      }];
  
  
     
  
      const getConnRenewal = async() => {
  
        const ConnRenewal_count = await ConnRenewal.count({ where: {status_id :{'!': Status.DELETED} }});
        if (!ConnRenewal_count){
          return new CustomError('document not found', {
            status: 403
          });
        }
        let connRenewal = await ConnRenewal.find(queryObject).populate('connection');;
        if (!connRenewal){
          return new CustomError('connRenewal not found', {
            status: 403
          });
        }
        const responseObject = {
          connRenewal: connRenewal,
          totalCount: ConnRenewal_count,
          perPage: params.per_page,
          currentPage: params.page
        };
        return responseObject;
      }
  
      getConnRenewal()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
    },
    findOne: function (req, res) {

      if (!(req.param('id')) || isNaN(req.param('id')))
        return res.badRequest('Not a valid request');
      let ConnRenewalId = req.param('id');
      let queryObject = {
        where: {id: ConnRenewalId , status_id :{'!': Status.DELETED} }
      };
      const getConnRenewal = async() => {
        let connRenewal = await ConnRenewal.findOne(queryObject).populate('connection');
  
        if (connRenewal)
          return connRenewal;
        else
          return new CustomError('ConnRenewal not found', {
            status: 403
          });
  
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
      }
  
      getConnRenewal()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    update: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
      let ConnRenewalId = req.param('id');
  
      const updateConnRenewal = async() => {
  
        const oldConnRenewal = await ConnRenewal.count({
          id: ConnRenewalId
        });
  
        if (oldConnRenewal < 1) {
          return new CustomError('Invalid ConnRenewal  Id', {
            status: 403
          });
        }
  
        let connRenewal = {};
  
        if (req.param('renewal_date') != undefined && _.isString(req.param('renewal_date'))) {
          connRenewal.renewal_date = req.param('renewal_date');
        }
        if (req.param('connection_id') != undefined && _.isNumber(req.param('connection_id'))) {
          connRenewal.connection = req.param('connection_id');
        }
        if (req.param('status_id') != undefined && _.isNumber(req.param('status_id'))) {
          connRenewal.status_id = req.param('status_id');
        }
  
  
        const updatedConnRenewal = await ConnRenewal.update({
          id: ConnRenewalId
        }, connRenewal).fetch();
  
        if (updatedConnRenewal)
          return updatedConnRenewal;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      updateConnRenewal()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    delete: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
  
      let ConnRenewalId = req.param('id');
      let queryObject = {
        where: {id: ConnRenewalId , status_id :{'!': Status.DELETED} }
      };
      const deleteConnRenewal = async() => {
  
        const checkConnRenewal = await ConnRenewal.count(queryObject);
  
        if (checkConnRenewal < 1) {
          return new CustomError('Invalid ConnRenewal Id', {
            status: 403
          });
        }
  
  
        const deletedConnRenewal = await ConnRenewal.update({
          id: ConnRenewalId
        }, {
          status_id: Status.DELETED
        }).fetch();
  
        if (deletedConnRenewal)
          return deletedConnRenewal;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      deleteConnRenewal()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
  
  
    }
};