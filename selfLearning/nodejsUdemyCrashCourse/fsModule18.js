const fs = require('fs');

// Lists all the files of current directory. Synchronous or Blocking Function
// const files = fs.readdirSync('./');
// console.log(files)

// Asynchronous Function
fs.readdir('$', function(err, files) {
	if (err) console.log('Error:', err);
	else console.log('Result', files);
});
