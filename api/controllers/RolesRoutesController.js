/**
 * RolesRoutesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    create:function(req,res){       

    if (!req.param('role_id') || !_.isNumber(req.param('role_id'))) {
      return res.badRequest("role_id required");
    }

    if (!req.param('routes_id') || !_.isNumber(req.param('routes_id'))) {
      return res.badRequest("routes_id required");
    }
    const process = async () => {

      const newRolesRoutes = await RolesRoutes.create({
        'roles': req.param('role_id'),
        'routes': req.param('routes_id'),
        'description': req.param('description'),
        'status_id': Status.ACTIVE,    
      }).fetch();
     
      if (newRolesRoutes)
        return newRolesRoutes;

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
          sort: 'status_id',
          query: ''
        });
  
      var sortable = ['status_id'];
  
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
        'status_id': {
          'like': '%' + params.query + '%'
        }
      }];
  
  
     
  
      const getRolesRoutes = async() => {
  
        const RolesRoutes_count = await RolesRoutes.count({ where: {status_id :{'!=': Status.DELETED} }});
        if (!RolesRoutes_count){
          return new CustomError('RolesRoutes not found', {
            status: 403
          });
        }
        let rolesRoutes = await RolesRoutes.find(queryObject).populate('roles').populate('routes');
        if (!rolesRoutes){
          return new CustomError('RolesRoutes not found', {
            status: 403
          });
        }
        const responseObject = {
          rolesRoutes: rolesRoutes,
          totalCount: RolesRoutes_count,
          perPage: params.per_page,
          currentPage: params.page
        };
        return responseObject;
      }
  
      getRolesRoutes()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
    },
    findOne: function (req, res) {

      if (!(req.param('id')) || isNaN(req.param('id')))
        return res.badRequest('Not a valid request');
      let RolesRoutesId = req.param('id')
      let queryObject = {
        where: {id: RolesRoutesId , status_id :{'!=': Status.DELETED} }
      };
      const getRolesRoutes = async() => {
        let rolesRoutes = await RolesRoutes.findOne(queryObject).populate('roles').populate('routes');
  
        if (rolesRoutes)
          return rolesRoutes;
        else
          return new CustomError('RolesRoutes not found', {
            status: 403
          });
  
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
      }
  
      getRolesRoutes()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    update: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
      let RolesRoutesId = req.param('id');
  
      const updateRolesRoutes = async() => {
  
        const oldRolesRoutes = await RolesRoutes.count({
          id: RolesRoutesId
        });
  
        if (oldRolesRoutes < 1) {
          return new CustomError('Invalid RolesRoutes  Id', {
            status: 403
          });
        }
  
        let rolesRoutes = {};
  
        if (req.param('role_id') != undefined && _.isNumber(req.param('role_id'))) {
          rolesRoutes.roles = req.param('role_id');
        }
        if (req.param('routes_id') != undefined && _.isNumber(req.param('routes_id'))) {
          rolesRoutes.routes= req.param('routes_id');
        }
        if (req.param('description') != undefined && _.isString(req.param('description'))) {
            rolesRoutes.description = req.param('description');
          }
        if (req.param('status_id') != undefined && _.isNumber(req.param('status_id'))) {
          rolesRoutes.status_id = req.param('status_id');
        }
        description
  
        const updatedRolesRoutes = await RolesRoutes.update({
          id: RolesRoutesId
        }, rolesRoutes).fetch();
  
        if (updatedRolesRoutes)
          return updatedRolesRoutes;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      updateRolesRoutes()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    delete: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
  
      let RolesRoutesId = req.param('id');
      let queryObject = {
        where: {id: RolesRoutesId , status_id :{'!=': Status.DELETED} }
      };
      const deleteRolesRoutes = async() => {
  
        const checkRolesRoutes = await RolesRoutes.count(queryObject);
  
        if (checkRolesRoutes < 1) {
          return new CustomError('Invalid RolesRoutes Id', {
            status: 403
          });
        }
  
  
        const deletedRolesRoutes = await RolesRoutes.update({
          id: RolesRoutesId
        }, {
          status_id: Status.DELETED
        }).fetch();
  
        if (deletedRolesRoutes)
          return deletedRolesRoutes;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      deleteRolesRoutes()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
  
  
    }
};

