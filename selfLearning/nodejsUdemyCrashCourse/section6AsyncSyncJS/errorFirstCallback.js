const param = 1;

console.log('Started',param );

function doSomething(param, callback){
	console.log('Doing', param);
	// Takes time to something
	setTimeout( () => {
		if(typeof param === 'string') {
			callback(null,{result: 'Done', param});
		}else{
			callback(new Error('type is not string'),null);
		}
	}, 1000);
}

doSomething(param, (err,result) => {
	if (err) {
		console.log(err);
	}else{
		console.log(result);
	}

	console.log('Done', param);
});
