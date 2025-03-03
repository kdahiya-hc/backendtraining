// No need to import anything as it is present by default

// argv get passed arguments
console.log(process.argv);
console.log(process.argv[1]);

// System valriables
console.log(process.env.LOGNAME)

// ID of NodeJS process, cwd, title of nodejs process
// pid
console.log('Process ID:',process.pid);
//cwd()
console.log('Current working directory: ',process.cwd());
// title
console.log('Nodejs process name: ',process.title);
// memoryUsage()
console.log('Memoery usage: ',process.memoryUsage());
// upTime() of system in os module, uptime() of process
console.log('Process uptime()',process.uptime());

// Triggered when process.exit() is encountered or default exit
process.on('exit', (code) => {
	console.log('About to exit with code: ', code);
})
// exit of process 0 success and 1 is general error
// console.log(process.exit(0));
// console.log(process.exit(1)); // crashes the project

console.log('Actual default exit ') // Wont show up when process.exit is run up
