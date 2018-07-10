module.exports = {
	'getUser': function(user_id) {
	
        return new Promise(function(resolve, reject) {
            const user = User.findOne({ id: user_id });
                if (user) {
                   resolve(user);
                }
                else{
                    reject('not found');
                }

        });
    },
    'getCustomer': function(id) {
	
        return new Promise(function(resolve, reject) {
            const customer = Customers.findOne({ id: id });
                if (customer) {
                   resolve(customer);
                }
                else{
                    reject('not found');
                }

        });
    },
    fn: async function (inputs, exits) {

        // Run the query
        var users = await User.find({
          active: true,
          lastLogin: { '>': inputs.activeSince }
        })
        .sort('lastLogin DESC')
        .limit(inputs.numUsers);
    
        // If no users were found, trigger the `noUsersFound` exit.
        if (users.length === 0) {
          throw 'noUsersFound';
        }
    
        // Otherwise return the records through the `success` exit.
        return exits.success(users);
    
      }
    
};