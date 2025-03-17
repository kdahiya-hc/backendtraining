function asyncHandler(routeFunction){
	return async(req, res, next) => {
		console.log('inside asyncHandler')
		try{
			await routeFunction(req, res, next);
		}catch(err){
			next(err);
		}
	};
}

module.exports = asyncHandler;