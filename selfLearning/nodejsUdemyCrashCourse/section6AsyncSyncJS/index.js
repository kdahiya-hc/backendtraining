getUser(1, (user) => {
	console.log(user);
	getRepos(user.username, (repositories) => {
		console.log(repositories);
		getCommits(repositories[0], (commits) => {
			console.log(commits);
		});
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

function getCommits(repository, getCommitsCallback){
	setTimeout(() => {
		console.log('Getting commits')
		getCommitsCallback([
			{ commitID: '1d923r'},
			{ commitID: '91sbu3'},
		]);
	},2000);
}
