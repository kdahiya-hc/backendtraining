
const users = [
	{ id: 1, gitHubUsername: 'kdahiya-hc'},
	{ id: 2, gitHubUsername: 'kishandahiya'}
	]

const repositories = [
	{ gitHubUsername: 'kdahiya-hc', repoName: 'repo1'},
	{ gitHubUsername: 'kishandahiya', repoName: 'repo2'},
]

const commits = [
	{ repoName: 'repo1', commitID: '1d923r'},
	{ repoName: 'repo2', commitID: '91sbu3'},
	{ repoName: 'repo1', commitID: '23rfuh'},
	{ repoName: 'repo2', commitID: '9hrdf3'},
]

getUser(1)
 .then(user => {
	console.log("User data:", user);
	return getRepo(user.gitHubUsername)})
 .then(repoName => {
	console.log("Repositroy:", repoName);
	return getCommit(repoName.repoName)
})
.then(commit => {
	console.log("Commit:", commit);
})
.catch(err => console.log('Error', err));

function getUser(id){
	return new Promise((resolve, reject) => {
		setTimeout(function(){
			console.log('Getting user data');
			resolve(users.find(user => user.id === id));
		}, 2000);
	});
}

function getRepo(gitHubUsername){
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('Getting repository')
			resolve(repositories.find(repo => repo.gitHubUsername === gitHubUsername));
		},2000);
	})
}

function getCommit(repoName){
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('Getting commits')
			resolve(commits.filter(commit => commit.repoName === repoName));
		},2000);
	})
}
