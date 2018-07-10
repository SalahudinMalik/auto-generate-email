module.exports = function(req, res, next) {
	var token;
	//Check if authorization header is present
	if(req.headers && req.headers.authorization) {
		//authorization header is present
		var parts = req.headers.authorization.split(' ');
		if(parts.length == 2) {
			var scheme = parts[0];
			var credentials = parts[1];
			
			if(/^Bearer$/i.test(scheme)) {
				token = credentials;
			}
		} else {
			return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
		}
	} else {
		//authorization header is not present
		return res.json(401, {err: 'No Authorization header was found'});
	}

	
	jwToken.verify(token, function(err, token) {
		
		if(err) {
			return res.json(401, {err: 'Invalid token'});
		}
	//	console.log("token ", token)

			User.findOne({
			  id: token.user
			})
			  .then(user=>{
				//    console.log("user ", user)
				// sails.log.verbose({'id':token.admin.id, 'timeStamp':new Date()});
				req.token = token;
				next();
			  })
			  
  
		  
		// req.user = decoded;
		// next();
	});
};

