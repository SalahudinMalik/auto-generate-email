
var Passwords = require('machinepack-passwords');
var Promise = require('bluebird')
module.exports = {
	'checkPassword': function(user_password , db_password) {
		// return jwt.sign({
		// 	data: payload
        // }, sails.config.secret, {expiresIn: 30});
        return new Promise(function(resolve, reject) {
            Passwords.checkPassword({

                passwordAttempt: user_password,
                
                encryptedPassword: db_password,
                
                }).exec({
                
                // An unexpected error occurred.
                
                error: function (err) {
                   // return res.json({error : 'User password error'});
                    resolve({error : 'User password error'});
                
                
                },
                
                // Password attempt does not match already-encrypted version
                
                incorrect: function () {
                
                    //return res.json({error : 'User password is incorrect'});
                    resolve({error : 'User password is incorrect'});
                
                
                },
                
                // OK.
                
                success: function () {
                   
                 //return true;
                 resolve(true);
                },
                
                });
           
        });
        
    },
    'encryptPassword': function(input){
         return new Promise(function(resolve, reject) {
           
                Passwords.encryptPassword({

                    password: input,
                    
                    }).exec({
                    
                    // An unexpected error occurred.
                    
                    error: function (err) {
                    
                        //return res.json();
                        resolve({error: 'data encryption error'});
                    },
                    
                    // OK.
                    
                    success: function (result) {
                    
                        resolve(result);
                    
                    },
                    
                    });
            
                
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