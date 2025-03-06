const param = 1;

console.log('Started',param );

function doSomething(param, callback){
	// Takes time to something
	setTimeout( () => {
		console.log('Doing', param);
		callback({result: 'Done', param});
	}, 1000);
}

doSomething(param, (result) => {
	console.log(result);
	console.log('Done', param);
});
