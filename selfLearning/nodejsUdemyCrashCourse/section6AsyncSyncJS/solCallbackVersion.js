const users = [
    { id: 1, gitHubUsername: 'kdahiya-hc' },
    { id: 2, gitHubUsername: 'kishandahiya' }
];

const repositories = [
    { gitHubUsername: 'kdahiya-hc', repoName: 'repo1' },
    { gitHubUsername: 'kishandahiya', repoName: 'repo2' },
];

const commits = [
    { repoName: 'repo1', commitID: '1d923r' },
    { repoName: 'repo2', commitID: '91sbu3' },
    { repoName: 'repo1', commitID: '23rfuh' },
    { repoName: 'repo2', commitID: '9hrdf3' },
];

// Using Callback
getUser(1, (user) => {
    console.log(user);
    getRepos(user.gitHubUsername, (repos) => {
        console.log(repos);
        getCommits(repos[0].repoName, (commits) => {
            console.log(commits);
        });
    });
});

function getUser(id, callback) {
    setTimeout(function () {
        console.log('Getting user data');
        callback(users.find(user => user.id === id));
    }, 2000);
}

function getRepos(gitHubUsername, callback) {
    setTimeout(() => {
        console.log('Getting repository');
        callback(repositories.find(repo => repo.gitHubUsername === gitHubUsername));
    }, 2000);
}

function getCommits(repoName, callback) {
    setTimeout(() => {
        console.log('Getting commits');
        callback(commits.filter(commit => commit.repoName === repoName));
    }, 2000);
}
