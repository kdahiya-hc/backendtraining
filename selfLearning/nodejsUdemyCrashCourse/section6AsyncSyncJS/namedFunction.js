getUser(1, displayUsers);
// Named function 1
function displayUsers(users){
	console.log(users);
	getRepos(users.username, displayRepo);
}

//Named fucntion 2
function displayRepo(repositories){
	console.log(repositories);
}

function getUser(id, getUserCallback){
	setTimeout(function(){
		console.log('Getting user data');
		getUserCallback({ id: id, gitHubUsername: 'kdahiya-hc'});
	}, 2000);
}

function getRepos(username, getReposCallback){
	setTimeout(() => {
		console.log('Getting repository')
		getReposCallback([
			{ name: 'repo1'},
			{ name: 'repo2'},
		]);
	},2000);
}
