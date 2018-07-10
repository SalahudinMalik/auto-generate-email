/**
 * UsersRoutesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    create:function(req,res){       

    if (!req.param('user_id') || !_.isNumber(req.param('user_id'))) {
      return res.badRequest("user_id required");
    }

    if (!req.param('routes_id') || !_.isNumber(req.param('routes_id'))) {
      return res.badRequest("routes_id required");
    }
   
    const process = async () => {

      const newUsersRoutes = await UsersRoutes.create({
        'user': req.param('user_id'),
        'routes': req.param('routes_id'),
        'status_id': Status.ACTIVE,    
      }).fetch();
     
      if (newUsersRoutes)
        return newUsersRoutes;

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
  
  
     
  
      const getUsersRoutes = async() => {
  
        const UsersRoutes_count = await UsersRoutes.count({ where: {status_id :{'!=': Status.DELETED} }});
        if (!UsersRoutes_count){
          return new CustomError('Users Route not found', {
            status: 403
          });
        }
        let usersRoutes = await UsersRoutes.find(queryObject).populate('user').populate('routes');
        if (!usersRoutes){
          return new CustomError('Users Route not found', {
            status: 403
          });
        }
        const responseObject = {
          usersRoutes: usersRoutes,
          totalCount: UsersRoutes_count,
          perPage: params.per_page,
          currentPage: params.page
        };
        return responseObject;
      }
  
      getUsersRoutes()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
    },
    findOne: function (req, res) {

      if (!(req.param('id')) || isNaN(req.param('id')))
        return res.badRequest('Not a valid request');
      let UsersRoutesId = req.param('id')
      let queryObject = {
        where: {id: UsersRoutesId , status_id :{'!=': Status.DELETED} }
      };
      const getUsersRoutes = async() => {
        let usersRoutes = await UsersRoutes.findOne(queryObject).populate('user').populate('routes');
  
        if (usersRoutes)
          return usersRoutes;
        else
          return new CustomError('UsersRoutes not found', {
            status: 403
          });
  
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
      }
  
      getUsersRoutes()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    update: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
      let UsersRoutesId = req.param('id');
  
      const updateUsersRoutes = async() => {
  
        const oldUsersRoutes = await UsersRoutes.count({
          id: UsersRoutesId
        });
  
        if (oldUsersRoutes < 1) {
          return new CustomError('Invalid UsersRoutes  Id', {
            status: 403
          });
        }
  
        let usersRoutes = {};
  
        if (req.param('user_id') != undefined && _.isNumber(req.param('user_id'))) {
          usersRoutes.user = req.param('user_id');
        }
        if (req.param('routes_id') != undefined && _.isNumber(req.param('routes_id'))) {
          usersRoutes.routes = req.param('routes_id');
        }
        if (req.param('status_id') != undefined && _.isNumber(req.param('status_id'))) {
          usersRoutes.status_id = req.param('status_id');
        }
  
  
        const updatedUsersRoutes = await UsersRoutes.update({
          id: UsersRoutesId
        }, usersRoutes).fetch();
  
        if (updatedUsersRoutes)
          return updatedUsersRoutes;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      updateUsersRoutes()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    delete: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
  
      let UsersRoutesId = req.param('id');
      let queryObject = {
        where: {id: UsersRoutesId , status_id :{'!=': Status.DELETED} }
      };
      const deleteUsersRoutes = async() => {
  
        const checkUsersRoutes = await UsersRoutes.count(queryObject);
  
        if (checkUsersRoutes < 1) {
          return new CustomError('Invalid Users Routes Id', {
            status: 403
          });
        }
  
  
        const deletedUsersRoutes = await UsersRoutes.update({
          id: UsersRoutesId
        }, {
          status_id: Status.DELETED
        }).fetch();
  
        if (deletedUsersRoutes)
          return deletedUsersRoutes;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      deleteUsersRoutes()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
  
  
    }
};
