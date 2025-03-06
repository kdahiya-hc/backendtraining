getUser(1, (user) => {
	console.log(user);
	getRepos(user.username, (repositories) => {
		console.log(repositories);
	});
});

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

// // callbacks
// getUsers((users) => {
// 	console.log(users);
// });

// function getUsers(callback){
// 	setTimeout(() => {
// 		console.log('Logging');
// 		callback([
// 			{ id: 1, username: 'Kishan' },
// 			{ id: 2, username: 'Jayshah'},
// 		])
// 	}, 1000);
// }
