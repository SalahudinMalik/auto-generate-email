/**
 * RolesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    create:function(req,res){       

    if (!req.param('name') || !_.isString(req.param('name'))) {
      return res.badRequest("name required");
    }
    
    const process = async () => {

      const newRoles = await Roles.create({
        'name': req.param('name'),
        'description': req.param('description'),
        'status_id': Status.ACTIVE,    
      }).fetch();
     
      if (newRoles)
        return newRoles;

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
          sort: 'name',
          query: ''
        });
  
      var sortable = ['name'];
  
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
        'name': {
          'like': '%' + params.query + '%'
        }
      }];
  
  
     
  
      const getRoles = async() => {
  
        const Roles_count = await Roles.count({ where: {status_id :{'!=': Status.DELETED} }});
        if (!Roles_count){
          return new CustomError('roles not found', {
            status: 403
          });
        }
        let roles = await Roles.find(queryObject);
        if (!roles){
          return new CustomError('roles not found', {
            status: 403
          });
        }
        const responseObject = {
          roles: roles,
          totalCount: Roles_count,
          perPage: params.per_page,
          currentPage: params.page
        };
        return responseObject;
      }
  
      getRoles()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
    },
    findOne: function (req, res) {

      if (!(req.param('id')) || isNaN(req.param('id')))
        return res.badRequest('Not a valid request');
      let RolesId = req.param('id')
      let queryObject = {
        where: {id: RolesId , status_id :{'!=': Status.DELETED} }
      };
      const getRoles = async() => {
        let roles = await Roles.findOne(queryObject);
  
        if (roles)
          return roles;
        else
          return new CustomError('Roles not found', {
            status: 403
          });
  
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
      }
  
      getRoles()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    update: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
      let RolesId = req.param('id');
  
      const updateRoles = async() => {
  
        const oldRoles = await Roles.count({
          id: RolesId
        });
  
        if (oldRoles < 1) {
          return new CustomError('Invalid Roles  Id', {
            status: 403
          });
        }
  
        let roles = {};
  
        if (req.param('name') != undefined && _.isString(req.param('name'))) {
            roles.name = req.param('name');
        }
        if (req.param('description') != undefined && _.isString(req.param('description'))) {
            roles.description = req.param('description');
        }
        if (req.param('status_id') != undefined && _.isNumber(req.param('status_id'))) {
            roles.status_id = req.param('status_id');
        }
  
  
        const updatedRoles = await Roles.update({
          id: RolesId
        }, roles).fetch();
  
        if (updatedRoles)
          return updatedRoles;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      updateRoles()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    delete: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
  
      let RolesId = req.param('id');
      let queryObject = {
        where: {id: RolesId , status_id :{'!=': Status.DELETED} }
      };
      const deleteRoles = async() => {
  
        const checkRoles = await Roles.count(queryObject);
  
        if (checkRoles < 1) {
          return new CustomError('Invalid roles Id', {
            status: 403
          });
        }
  
  
        const deletedRoles = await Roles.update({
          id: RolesId
        }, {
          status_id: Status.DELETED
        }).fetch();
  
        if (deletedRoles)
          return deletedRoles;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      deleteRoles()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
  
  
    }
};