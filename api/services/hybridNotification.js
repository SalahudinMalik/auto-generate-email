const Email = require('email-templates');
const nodemailer = require('nodemailer');
var request = require("request");
var Promise = require("bluebird");
// var jsonfile = require('jsonfile')

const winston = require('winston');
const fs = require('fs');
// const env = process.env.NODE_ENV || 'development';
const logDir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/sms-results-%DATE%.log`,
      timestamp: tsFormat,
      datePattern: 'YYYY-MM-dd',
      prepend: true,
      level: 'verbose'
    })
  ]
});


let smsSentlog = { log: [] };

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'notify@net247.pk', // generated ethereal user
    pass: 'umarnet247' // generated ethereal password
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});




const email = new Email({
  message: {
    from: 'notify@net247.pk'
  },
  // uncomment below to send emails in development/test env:
  send: true,
  transport: transporter
});
var sendMail = async function (_users, _to , days) {
  await email
    .send({
      template: 'net247',
      message: {
        // to: 'umarbits@gmail.com'
        to: _to
      },
      locals: {
        name: 'Umar',
        customers: _users,
        expireIn: days,
        // week: _users.week,
        // reportDate: _users.reportDate
      }
    });
}
var emailSMSLog = async function (_messages, _to) {
  await email
    .send({
      template: 'smslog',
      message: {
        // to: 'umarbits@gmail.com'
        // to: 'rizwan.seing@gmail.com'
        to: _to
      },
      locals: {
        today: _messages.today,
        threeday: _messages.threeday,
        week: _messages.week,
        raw: smsSentlog.log
      }
    });
}

let sendSMS = async function (_to, _message) {
  var options = {
    method: 'GET',
    url: 'http://lifetimesms.com/json',
    qs:
    {
      username: 'umarbits',
      password: 'umarumar',
      to: _to,
      from: '8584',
      message: _message
    }
  };

  console.log("message: ", _message);
  await request(options, function (error, response, body) {
    // console.log("response")
    if (error) {
      logger.verbose({
        to: _to,
        message: _message,
        isError: true,
        response: body
      });
      
      console.log("sms err: ", error)
    } else {
      console.log("sms body: ", body);

      logger.verbose({
        to: _to,
        message: _message,
        isError: false,
        response: body
      });
      
    }


  });
}

let smslog = {
  today: [],
  threeday: [],
  week: []
};
let sendBulkSMS = async function (_smsObject) {


  // let _to = "923345111683";
  // let _customer = _smsObject.today[0];

  //--------------------------------------------------- EXPIRING TODAY   ---------------
  _smsObject.today.map((_customer) => {
    let _to;

    let dealerContact = _smsObject.dealersExpClients[_customer.areadealer].contact.length == 11 ? _smsObject.dealersExpClients[_customer.areadealer].contact : "";
    let message = `Dear  ` + _customer.customer + `
Your Internet Subscription has been expired:-
ID: `+ _customer.username + `
Package: `+ _customer.package + `

Please Recharge to avoid disconnection.
    
Please ignore if you already recharged.
    
Thanks
Net247 Powered by CyberNET
`+ dealerContact + `
03000-128247
www.Net247.PK
www.facebook.com/Net247PK`;

    _to = _customer.contact.replace('-', '');
    if (_to.charAt(0) == '0') {
      _to = _to.substring(1, _to.length);
      _to = '92' + _to;
    }
    else if (_to.charAt(0) != '9') {
      _to = '92' + _to;
    }
    sendSMS(_to, message);
 
    smslog.today.push({ to: _to, message: message });
    console.log("sms >>>>>>>>>>>>")
    console.log(_to, "||| ", message)

  }); //end of loop for todays custommer
  //--------------------------------------------------- EXPIRING IN 3 DAYS   ---------------
  _smsObject.threeday.map((_customer) => {
    let _to;

    let dealerContact = _smsObject.dealersExpClients[_customer.areadealer].contact.length == 11 ? _smsObject.dealersExpClients[_customer.areadealer].contact : "";
    let message = `Dear  ` + _customer.customer + `
Your Internet Subscription:-
ID: `+ _customer.username + `
Package: `+ _customer.package + `

Will expire soon, Please Recharge to avoid disconnection.

Please ignore if you already recharged.

Thanks
Net247 Powered by CyberNET
`+ dealerContact + `
03000-128247
www.Net247.PK
www.facebook.com/Net247PK`;

    _to = _customer.contact.replace('-', '');
    if (_to.charAt(0) == '0') {
      _to = _to.substring(1, _to.length);
      _to = '92' + _to;
    }
    else if (_to.charAt(0) != '9') {
      _to = '92' + _to;
    }
    sendSMS(_to, message);
    smslog.threeday.push({ to: _to, message: message });
    console.log("sms >>>>>>>>>>>>")
    console.log(_to, "||| ", message)

  }); //end of loop for 3 DAY custommer
  //--------------------------------------------------- EXPIRING IN Week  ---------------
  _smsObject.week.map((_customer) => {
    let _to;

    let dealerContact = _smsObject.dealersExpClients[_customer.areadealer].contact.length == 11 ? _smsObject.dealersExpClients[_customer.areadealer].contact : "";
    let message = `Dear  ` + _customer.customer + `
Your Internet Subscription:-
ID: `+ _customer.username + `
Package: `+ _customer.package + `

Will expire within a week, Please Recharge to avoid disconnection.

Please ignore if you already recharged.

Thanks
Net247 Powered by CyberNET
`+ dealerContact + `
03000-128247
www.Net247.PK
www.facebook.com/Net247PK`;

    _to = _customer.contact.replace('-', '');
    if (_to.charAt(0) == '0') {
      _to = _to.substring(1, _to.length);
      _to = '92' + _to;
    }
    else if (_to.charAt(0) != '9') {
      _to = '92' + _to;
    }
    sendSMS(_to, message);
    smslog.week.push({ to: _to, message: message });
    console.log("sms >>>>>>>>>>>>")
    console.log(_to, "||| ", message)

  }); //end of loop for 3 DAY custommer

  _smsObject.dealersList.map((_dealers) => {

    if (_smsObject.dealersExpClients[_dealers].contact.length === 11) {
      if (_smsObject.dealersExpClients[_dealers].today.length > 0 || _smsObject.dealersExpClients[_dealers].threeday.length > 0 || _smsObject.dealersExpClients[_dealers].week.length > 0) {
        let expToday = "";
        let expThreeday = "";
        let expWeek = "";
        _smsObject.dealersExpClients[_dealers].today.map((_list) => {
          expToday = expToday + `
` + _list;
        })
        _smsObject.dealersExpClients[_dealers].threeday.map((_list) => {
          expThreeday = expThreeday + `
`+ _list;
        })
        _smsObject.dealersExpClients[_dealers].threeday.map((_list) => {
          expWeek = expWeek + `
`+ _list;
        })

        let customerExpiring = ``;

        if (expToday.length !== 0) {
          customerExpiring = customerExpiring + `Customers Expiring Today` + `
`+ expToday
        } if (expThreeday.length !== 0) {
          customerExpiring = customerExpiring + `

Expiring in 3 Days
`+ expThreeday;
        } if (expWeek.length !== 0) {
          customerExpiring = customerExpiring + `

Expiring in Week
`+ expWeek
        }

        console.log("_______________dsms________________")

        let _todealer = _smsObject.dealersExpClients[_dealers].contact.replace('-', '');
        if (_todealer.charAt(0) == '0') {
          _todealer = _todealer.substring(1, _todealer.length);
          _todealer = '92' + _todealer;
        }
        else if (_todealer.charAt(0) != '9') {
          _todealer = '92' + _todealer;
        }
        sendSMS(_todealer, customerExpiring);
        console.log(_todealer, " > ", customerExpiring);
      }
    }
  })

  console.log("'''''''''''''''''''''''''''''Sending SMS Log ==================================");

  emailSMSLog(smslog, 'umarbits@gmail.com')
  emailSMSLog(smslog, 'rizwan.seing@gmail.com')



}

var hmail = {
  sendMail: sendMail,
  sendSMS: sendSMS,
  sendBulkSMS: sendBulkSMS
}

module.exports = hmail


// sendMail([1,2])