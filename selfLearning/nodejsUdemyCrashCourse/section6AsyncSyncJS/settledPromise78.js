// Resolved Promise
const p1 = Promise.resolve({id: 1});
p1.then(result => console.log(result));
// Error caught with object and shows error stack
const p2 = Promise.reject(new Error('Reason of reject'));
p2.catch(err => console.log(err.message));
