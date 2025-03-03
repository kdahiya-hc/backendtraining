import url from 'url';

const urlString = 'https://www.google.com/search?q=hello+world';

// URL Object
const urlObj = new URL(urlString);
console.log(urlObj);

// format() : gives us the url in string form
console.log(url.format(urlString));

// import.meta.url - file URL
console.log(import.meta.url);

// fileURLToPath - gives regular file url as Path
console.log(url.fileURLToPath(import.meta.url)) // aka __filename

console.log(urlObj.search);

// Object of search params
const params = new URLSearchParams(urlObj.search);
console.log(params);

// gets just the value of key
console.log(params.get('q'));
// appends
params.append('limit', '5');
// deletes
params.delete('limit')
console.log(params);
