function asyncHandler(routeFunction){
	return async(req, res, next) => {
		try{
			console.log('inside asyncHandler')
			await routeFunction(req, res, next);
		}catch(err){
			next(err);
		}
	};
}

module.exports = asyncHandler;