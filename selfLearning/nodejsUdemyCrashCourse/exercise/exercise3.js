async function contactCustomer() {
	try{
		const customer = await getCustomer();
		if (customer.isGold === true){
			console.log('Customer: ', customer);
			const topMovies = await getTopMovies();
			console.log('Top movies: ', topMovies);
			await sendEmail(customer.email, topMovies);
			console.log('Email sent...')
		}else{
			throw new Error('No Gold customer');
		}
	}catch(error){
		console.log(error.message);
	}
}

contactCustomer();

  function getCustomer() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
			  id: 1,
			  name: 'Mosh Hamedani',
			  isGold: false,
			  email: 'email'
			});
		  }, 4000);
	});
  }

  function getTopMovies() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(['movie1', 'movie2']);
		  }, 4000);
	});
  }

  function sendEmail(email, movies, callback) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		  }, 4000);
	});
  }
