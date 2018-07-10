/**
 * DocumentsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var _ = require('lodash'); 
module.exports = {

    create:function(req,res){       

    if (!req.param('file_name') || !_.isString(req.param('file_name'))) {
      return res.badRequest("file_name required");
    }

    if (!req.param('file_path') || !_.isString(req.param('file_path'))) {
      return res.badRequest("file_path required");
    }
    console.log(req.param('customer_id'));
    const process = async () => {

      const newDocuments = await Documents.create({
        'file_name': req.param('file_name'),
        'file_path': req.param('file_path'),
        'customers': req.param('customer_id'),
        'status_id': Status.ACTIVE,    
      }).fetch();
     
      if (newDocuments)
        return newDocuments;

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
          sort: 'file_name',
          query: ''
        });
  
      var sortable = ['file_name'];
  
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
        'file_name': {
          'like': '%' + params.query + '%'
        }
      }];
  
  
     
  
      const getDocuments = async() => {
  
        const Documents_count = await Documents.count({ where: {status_id :{'!=': Status.DELETED} }});
        if (!Documents_count){
          return new CustomError('document not found', {
            status: 403
          });
        }
        let documents = await Documents.find(queryObject).populate('customers');;
        if (!documents){
          return new CustomError('document not found', {
            status: 403
          });
        }
        const responseObject = {
          documents: documents,
          totalCount: Documents_count,
          perPage: params.per_page,
          currentPage: params.page
        };
        return responseObject;
      }
  
      getDocuments()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
    },
    findOne: function (req, res) {

      if (!(req.param('id')) || isNaN(req.param('id')))
        return res.badRequest('Not a valid request');
      let DocumentsId = req.param('id')
      let queryObject = {
        where: {id: DocumentsId , status_id :{'!=': Status.DELETED} }
      };
      const getDocuments = async() => {
        let documents = await Documents.findOne(queryObject).populate('customers');
  
        if (documents)
          return documents;
        else
          return new CustomError('Documents not found', {
            status: 403
          });
  
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
      }
  
      getDocuments()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    update: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
      let DocumentsId = req.param('id');
  
      const updateDocuments = async() => {
  
        const oldDocuments = await Documents.count({
          id: DocumentsId
        });
  
        if (oldDocuments < 1) {
          return new CustomError('Invalid Documents  Id', {
            status: 403
          });
        }
  
        let documents = {};
  
        if (req.param('file_name') != undefined && _.isString(req.param('file_name'))) {
          documents.file_name = req.param('file_name');
        }
        if (req.param('file_path') != undefined && _.isString(req.param('file_path'))) {
          documents.file_path = req.param('file_path');
        }
        if (req.param('customer_id') != undefined && _.isNumber(req.param('customer_id'))) {
          documents.customers = req.param('customer_id');
        }
        if (req.param('status_id') != undefined && _.isNumber(req.param('status_id'))) {
          documents.status_id = req.param('status_id');
        }
  
  
        const updatedDocuments = await Documents.update({
          id: DocumentsId
        }, documents).fetch();
  
        if (updatedDocuments)
          return updatedDocuments;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      updateDocuments()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
    },
    delete: function (req, res) {
      if (!req.param('id') || isNaN(req.param('id'))) {
        return res.badRequest("Id is required");
      }
  
      let DocumentsId = req.param('id');
      let queryObject = {
        where: {id: DocumentsId , status_id :{'!=': Status.DELETED} }
      };
      const deleteDocuments = async() => {
  
        const checkDocuments = await Documents.count(queryObject);
  
        if (checkDocuments < 1) {
          return new CustomError('Invalid Document Id', {
            status: 403
          });
        }
  
  
        const deletedDocuments = await Documents.update({
          id: DocumentsId
        }, {
          status_id: Status.DELETED
        }).fetch();
  
        if (deletedDocuments)
          return deletedDocuments;
        return new CustomError('Some error occurred. Please contact development team for help.', {
          status: 403
        });
  
  
      }
      deleteDocuments()
        .then(res.ok)
        .catch(err => util.errorResponse(err, res));
  
  
  
    }
};