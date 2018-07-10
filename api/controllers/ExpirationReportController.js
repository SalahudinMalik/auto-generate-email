/**
 * ExpirationReportController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var moment = require('moment');
module.exports = {

    find: async function (req, res) {

        let lastMonth = moment(Date.now()).subtract(1, 'months');
        let daysInLastMonth  = moment(lastMonth, "YYYY-MM").daysInMonth() 
        let daysDiff = daysInLastMonth - req.param('days_difference');
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
                        const package = await Packages.findOne({id:v.connection.packages});

                        cObj.contact = customer.mobile;
                        cObj.username = customer.first_name;
                        cObj.areadealer = user.first_name;
                        cObj.activationDate = date;
                        cObj.package = package.package_name;
                        arrobj.push(cObj);
                    }
                }
                // console.log('arrobj ', arrobj);
                hybridNotification.sendMail(arrobj, user.email , req.param('days_difference'));
            });

            // console.log('return');
            return newdata;
        }

        getConnRenewal()
            .then(res.ok)
            .catch(err => util.errorResponse(err, res));
    },
};

