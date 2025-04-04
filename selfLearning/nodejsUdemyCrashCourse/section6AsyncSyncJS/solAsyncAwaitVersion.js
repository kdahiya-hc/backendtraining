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

async function fetchData() {
	try {
        const user = await getUser(1);
        console.log("User data:", user);

        const repos = await getRepo(user.gitHubUsername);
        console.log("Repositories:", repos);

        const commitsData = await getCommit(repos[0].repoName);
        console.log("Commits:", commitsData);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

fetchData();

function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log('Getting user data');
            resolve(users.find(user => user.id === id));
        }, 2000);
    });
}

function getRepo(gitHubUsername) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Getting repository');
            resolve(repositories.filter(repo => repo.gitHubUsername === gitHubUsername));
        }, 2000);
    });
}

function getCommit(repoName) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Getting commits');
            // resolve(commits.filter(commit => commit.repoName === repoName));
			reject(new Error('I rejected'));
        }, 2000);
    });
}
