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

	
	jwToken.verify(token, async function(err, token) {
		let strReq = req.url;
		
		if(_.includes(req.url , 'findOne') && (req.url.match(/\//g) || []).length == 3){
			let n = req.url.lastIndexOf('/');
			strReq = req.url.substring(0, n); 
			
		}
		const countRoute = await Routes.count({end_point :strReq});
		if(countRoute < 1){
			const newRoute = await Routes.create({
				'end_point': strReq,
				'status_id': Status.ACTIVE,
			}).fetch();
			if(newRoute){
				console.log('route created ', newRoute);
			}
		}
		if(err) {
			return res.json(401, {err: 'Invalid token'});
		}
		
	//	console.log("token ", token)
		let check = false;
		
			User.findOne({
			  id: token.user
			}).populate('role')
			  .then(user=>{
				
						
						RolesRoutes.find({roles: user.role.id ,  status_id :{'!=': Status.DELETED} }).populate('routes')
							.then(roleRoutes =>{
								
								for(let rr of roleRoutes){
									
									if(rr.routes.end_point == strReq){
										// console.log('success');
										check = true;
										break;
									}
									
								}
								
							});
					if(check){
						req.token = token;
						next();
					}
					UsersRoutes.find({user: user.id ,  status_id :{'!=': Status.DELETED} }).populate('routes')
						.then(userRoutes =>{
									
							for(let rr of userRoutes){
								
								if(rr.routes.end_point == strReq){
									check = true;
									break;
								}
								
							}
							if(!check){
								// res.send(401, {err: 'unauthrized url'});
								return res.status(401).send({err: 'unauthrized request'});
							}
							req.token = token;
							next();
						});
				// sails.log.verbose({'id':token.admin.id, 'timeStamp':new Date()});
				
			  })
			 
		// req.user = decoded;
		// next();
	});
};

