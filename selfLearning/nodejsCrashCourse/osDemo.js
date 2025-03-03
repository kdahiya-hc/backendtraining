import os, { freemem, totalmem } from 'os';

// userInfo() gives user info object
console.log(os.userInfo());

// totalmem() in bytes
console.log(totalmem());

// freemem() in bytes
console.log(freemem());

// cpus() shows all cpu processing cores 
console.log(os.cpus());
