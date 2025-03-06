const p1 = new Promise((resolve) => {
	setTimeout(() => {
		console.log("Inside p1");
		resolve('because 1 passed');
		// reject(new Error('because failed'));
	}, 2000);
})

const p2 = new Promise((resolve) => {
	setTimeout(() => {
		console.log("Inside p2");
		resolve('because 2 passed');
	}, 2000);
})

// Parallel Promises

// When any 1 fails all Fail
Promise.all([p1, p2])
.then(result => console.log('ALL Success',result))
.catch(err => console.log('ALL Fail',err.message))

// When even one pass all pass
Promise.race([p1, p2])
.then(result => console.log('RACE Success',result))
.catch(err => console.log('RACE Fail',err.message))
