'use strict';
let _ = require('lodash'),
Chance = require('chance'),
    random = new Chance();


module.exports.getEncryptedPassword = function (password, cb) {

  var passwordReg = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9\.\-\_\!]+){6,15}$/g;

  if (!passwordReg.test(password)) {
    return cb(false, 'Password must contain at least one digit and be between 6 and 15 characters long.');
  } else if (password.length < 6 || password.length > 15) {
    return cb(false, 'Password must be in between 6 and 15 characters');
  }

  require('machinepack-passwords').encryptPassword({
    password: password
  }).exec({
    error: function (err) {
      req.wantsJSON = true;
      if (!password) {
        //return res.badRequest('Missing password field');
        return cb(false, 'Missing password field');
      }
      return cb(false, err);
    },
    success: cb
  });
};


/**
 *
 * @param password
 * @returns {Promise} - A promise object
 */
module.exports.getEncryptedPasswordAsync = function (password) {

  return new Promise((resolve,reject) => {

  // let passwordReg = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9\.\-\_\!]+){6,15}$/g;

  // if (!passwordReg.test(password)) {
  //   return reject('Password must contain at least one digit and be between 6 and 15 characters long.');
  // } else if (password.length < 6 || password.length > 15) {
  //   return reject('Password must be in between 6 and 15 characters');
  // }
  require('machinepack-passwords').encryptPassword({
    password: password
  }).exec({
    error: function (err) {
      req.wantsJSON = true;
      if (!password) {
        //return res.badRequest('Missing password field');
        return reject( 'Missing password field');
      }
      return reject(err);
    },
    success: (enryptedPass) => {
      return resolve(enryptedPass);
    }
  });
  });
};


module.exports.getMyEncryptedPassword = function (password, callback) {
  require('machinepack-passwords').encryptPassword({
    password: password
  }).exec({
    error: function (err) {
      // req.wantsJSON = true;
      if (!password) {
        return callback('Missing password field', null);
      }
      return res.negotiate(err);
    },
    success: function (encryptedPassword) {
      return callback(null, encryptedPassword);
    }
  });
};

module.exports.isMatchedPasswordAsync = function (password, user, cb) {
  return new Promise((resolve,reject) => {
  require('machinepack-passwords').checkPassword({
    passwordAttempt: password,
    encryptedPassword: user.password
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return reject(err);
    },
    // Password attempt does not match already-encrypted version
    incorrect: function () {
      return reject(err);
    },
    // OK.
    success: function () {
      return resolve(true);
    }
  });
});
};



/**
 * a helper method to process error object and return apporpriate message based on status if err = instance of CustomError
 * @param {CustomError|Error} err - standard error
 * @param res - sails response object
 * @param {string} [responseFormat] - possible values: xml, json
 */
module.exports.errorResponse = function(err, res, responseFormat){
  let rsp = {}, _status = 500;
  if(!err) err = '';
  if(err instanceof CustomError){
    rsp = {err: err.message};
    if(err.errors){
      rsp.errors = _.clone(err.errors);
    }

    if(typeof err === 'object'){
      for(let prop in err){
        if(['message', 'status', 'errors', 'error', 'name', 'stack'].indexOf(prop) !== -1)continue;
        rsp[prop] = err[prop];
      }
    }

    _status = err.status || 500;



  }else if(err instanceof Error){
    rsp = {err: err.message};
  }else{
    rsp = err;
  }

  _status === 500 && sails.log.error(err);
  _status !== 500 && sails.log.verbose(err);

  if(responseFormat && responseFormat === 'xml'){
    const xml = require('xml');
    res.setHeader("Content-type", "text/xml");
    return res.send(xml(FeedService.objToXmlArray(rsp), {declaration: true}), _status);
  }else{
    res.send(rsp, _status);
  }
};

  module.exports.string = {
    random: {
      // Returns random integer
      number: function (length) {
        return random.integer({length: length});
      },
  
      // Returns random lowercase string
      lower: function (length) {
        return random.string({length: length, pool: _small});
      },
  
      // Returns random uppercase string
      upper: function (length) {
        return random.string({length: length, pool: _capital});
      },
  
      // Returns random uppercase/lowercase string
      letters: function (length) {
        return random.string({length: length, pool: _small + _capital});
      },
  
      // Returns random alpha-numeric string
      alphaNum: function (length) {
        return random.string({length: length, pool: _small + _capital + _num});
      },
  
      // Returns random alpha-numeric string with $ and ! characters
      any: function (length) {
        return random.string({length: length});
      },
      getPassword : () => {
        const passwordReg = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9\.\-]+){6,15}$/;
        return new RandExp(passwordReg).gen().slice(-14);
      }
    },
    capitalise: function(str){
      return str.split('_')
          .map((_str)=>_str.charAt(0).toUpperCase() + _str.slice(1).toLowerCase())
          .join(' ');
    },
    replaceAll: (str, find, replace) => {
      function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
      }
  
      return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    },
  
    /**
     * replace UUID in a string with text
     * @param {string} str - target string
     * @param {string} [replaceWith] - text that you want to put in place of UUID
     * @returns {string}
       */
    replaceUUID: function(str, replaceWith){
      replaceWith = _.isString(replaceWith) ? replaceWith : '';
      return str.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(-)?/ig, replaceWith);
    }
  
  

};
var moment = require('moment');
module.exports.sendNotification = async function(days){
  
  let lastMonth = moment(Date.now()).subtract(1, 'months');
  let daysInLastMonth  = moment(lastMonth, "YYYY-MM").daysInMonth() 
  let daysDiff = daysInLastMonth - days;
  let date = moment().subtract(daysDiff, 'days').calendar();
  let queryObject = {
      where: { status_id: { '!=': Status.DELETED }, renewal_date: { 'like': date } },
  };
  const getConnRenewal = async () => {

      const ConnRenewal_count = await ConnRenewal.count({ where: { status_id: { '!=': Status.DELETED }, renewal_date: { 'like': date } } });
      if (!ConnRenewal_count) {
          return new CustomError('ConnRenewal not found', {
              status: 403
          });
      }
      let connRenewal = await ConnRenewal.find(queryObject).populate('connection');
      if (!connRenewal) {
          return new CustomError('document not found', {
              status: 403
          });
      }
      // grouped data by dealer id

      var newdata = _.groupBy(connRenewal, "connection.dealer");
      
      // Foreach only used for group by
      _.forEach(newdata, async function (value, key) {
          let arrobj = [];
          // console.log('key ' + key);
          const user = await asyncdata.getUser(key);
          if (user) {
              // console.log('user.email ' + user.email)
          }
          for (const v of value) {
              let cObj = {
                  username: '',
                  // customer: '',
                  areadealer: '',
                  activationDate: '',
                  contact: '',
                  package: '',
              };
              const customer = await asyncdata.getCustomer(v.connection.customers); //Customers.findOne({ id: data.connection.customers });
              if (!customer) {
                  return new CustomError('customer not found', {
                      status: 403
                  });
              }
              else {
                  const packageDb = await Packages.findOne({id:v.connection.packages});

                  cObj.contact = customer.mobile;
                  cObj.username = customer.first_name;
                  cObj.areadealer = user.first_name;
                  cObj.activationDate = date;
                  cObj.package = packageDb.package_name;
                  arrobj.push(cObj);
              }
          }
          console.log('send mail');
          hybridNotification.sendMail(arrobj, user.email , days);
      });

      // console.log('return');
      return 'ok';
  }

  getConnRenewal()
      .then(result =>{return result})
      .catch(err => {return 'error'});
};
var jobs = [];
var CronJob = require('cron').CronJob;
module.exports.cronstart = async function (id , time ,expire){
  jobs[id]= new CronJob({
    cronTime:time, //'* * * * *',
    onTick: function() {
      console.log('job '+ id +' ticked ' + expire);
      util.sendNotification(expire);
    },
    start: false,
    timeZone: 'America/Los_Angeles'
  });
  jobs[id].start();

};
module.exports.cronstop = async function (id){
  jobs[id].stop();
  return true;
};