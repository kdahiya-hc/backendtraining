// Window is the top most object so no need to do window.Function
// console.log(window);

// window.alert(1)
// alert(1)

// Selecting things from DOM
// --------------Single element
// console.log(document.getElementById('my-form'))
// const form = document.getElementById('my-form')
// console.log(form)

//Query Selector
// console.log(document.querySelector('h1'))

// ----------Multiple element
// console.log(document.querySelectorAll('.item')) // Gives NodeList
// console.log(document.querySelectorAll('h1'))
// console.log(document.getElementsByClassName('item'));
// console.log(document.getElementsByTagName('li'));

// const items = document.getElementsByTagName('li')
// items.forEach(function(item){
// 	console.log(item);
// }); // items is HTMLCollection collection of items and not Array or List

// const items = document.querySelectorAll('li')
// items.forEach(function(item){
// 	console.log(item);
// }); // items is NodeList which is Array or List

const ul = document.querySelector('.items'); // First Occurance
// console.log(ul);
// ul.remove();

// ul.firstElementChild.textContent = "Kishan";
// ul.children[1].innerText = 'Kishan';
ul.lastElementChild.innerHTML = ''
