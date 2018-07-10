/**
 * RoutesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    create:function(req,res){       

    if (!req.param('end_point') || !_.isString(req.param('end_point'))) {
      return res.badRequest("end_point required");
    }

    const process = async () => {

      const newRoutes = await Routes.create({
        'end_point': req.param('end_point'),
        'description': req.param('description'),
        'status_id': Status.ACTIVE
      }).fetch();
     
      if (newRoutes)
        return newRoutes;

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
          sort: 'end_point',
          query: ''
        });
  
      var sortable = ['end_point'];
  
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
        where: {status_id :{'!=': Status.DELETED} },
        limit: parseInt(params.per_page),
        sort: '',
      };
      if (params.sort && _.indexOf(sortable, params.sort) > -1) {
        queryObject.sort = params.sort + ' ' + params.sort_dir;
      }
      queryObject.where.or = [{
        'end_point': {
          'like': '%' + params.query + '%'
        }
      }];
  
  
     
  
      const getRoutes = async() => {
  
        const Routes_count = await Routes.count({ where: {status_id :{'!=': Status.DELETED} }});
        if (!Routes_count){
          return new CustomError('Route not found', {
            status: 403
          });
        }
        let routes = await Routes.find(queryObject);
        if (!routes){
          return new CustomError('Route not found', {
            status: 403
          });
        }
        const responseObject = {
          routes: routes,
          totalCount: Routes_count,
          perPage: params.per_page,
          currentPage: params.page
        };
        return responseObject;
      }
  
      getRoutes()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
    },
    findOne: function (req, res) {

      if (!(req.param('id')) || isNaN(req.param('id')))
        return res.badRequest('Not a valid request');
      let RoutesId = req.param('id')
      let queryObject = {
        where: {id: RoutesId , status_id :{'!=': Status.DELETED} }
      };
      const getRoutes = async() => {
        let routes = await Routes.findOne(queryObject);
  
        if (routes)
          return routes;
        else
          return new CustomError('Routes not found', {
            status: 403
          });
  
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
      }
  
      getRoutes()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    update: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
      let RoutesId = req.param('id');
  
      const updateRoutes = async() => {
  
        const oldRoutes = await Routes.count({
          id: RoutesId
        });
  
        if (oldRoutes < 1) {
          return new CustomError('Invalid Routes  Id', {
            status: 403
          });
        }
  
        let routes = {};
  
        if (req.param('end_point') != undefined && _.isString(req.param('end_point'))) {
          routes.end_point = req.param('end_point');
        }
        if (req.param('description') != undefined && _.isString(req.param('description'))) {
          routes.description = req.param('description');
        }
        if (req.param('status_id') != undefined && _.isNumber(req.param('status_id'))) {
          routes.status_id = req.param('status_id');
        }
  
  
        const updatedRoutes = await Routes.update({
          id: RoutesId
        }, routes).fetch();
  
        if (updatedRoutes)
          return updatedRoutes;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      updateRoutes()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    delete: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
  
      let RoutesId = req.param('id');
      let queryObject = {
        where: {id: RoutesId , status_id :{'!=': Status.DELETED} }
      };
      const deleteRoutes = async() => {
  
        const checkRoutes = await Routes.count(queryObject);
  
        if (checkRoutes < 1) {
          return new CustomError('Invalid Route Id', {
            status: 403
          });
        }
  
  
        const deletedRoutes = await Routes.update({
          id: RoutesId
        }, {
          status_id: Status.DELETED
        }).fetch();
  
        if (deletedRoutes)
          return deletedRoutes;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      deleteRoutes()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
  
  
    }
};
