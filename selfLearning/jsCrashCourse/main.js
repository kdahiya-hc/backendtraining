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
// ul.lastElementChild.innerHTML = '<h1>HELLO</h1>'

// const btn = document.querySelector('.btn');
// btn.style.background = 'green'

// let count = 0;
// //--------------Events simple
// const btn = document.querySelector('.btn');
// btn.addEventListener('click', function(e){
// 	e.preventDefault(); //To remove submitting of form
// 	count+=1
// 	console.log(`clicked ${count}`);
// 	console.log(e.target.id); //Gives the targeted element and its properties can be fetched
// 	console.log(e);
// 	e.target.style.background = 'red';
// 	console.log(`The background of ${e.target} is ${e.target.style.background}`)
// 	btn.style.background = 'blue';
// 	console.log(`The background of ${btn} is ${btn.style.background}`)
// })

// const btn = document.querySelector('.btn');

// btn.addEventListener('mouseover', function(e){
// 	e.preventDefault();
// 	document.querySelector('.items').lastElementChild.style.backgroundColor = 'red';
// })

// const user = []
// const myForm = document.querySelector('#my-form');
// const nameInput = document.querySelector('#name');
// const emailInput = document.querySelector('#email');
// const msg = document.querySelector('.msg');
// const userList = document.querySelector('#users');

// myForm.addEventListener('submit', onSubmit);

// function onSubmit(e){
// 	e.preventDefault();
// 	if(nameInput.value === '' || emailInput.value === ''){
// 		msg.classList.add('error')
// 		msg.innerHTML = "Please enter all fields";

// 		setTimeout(() => {
// 			msg.classList.remove('error');
// 			msg.innerHTML = ''
// 		}, 1000);
// 	}else{
// 		console.log('Success');
// 		user.push({
// 			name: nameInput.value,
// 			email: emailInput.value
// 		});

// 		renderUserList();

// 		//clear fields
// 		nameInput.value = '';
// 		emailInput.value = '';
// 	}
// }

// function renderUserList(){
// 	userList.innerHTML = '';
// 	user.forEach(u =>{
// 		const li = document.createElement('li');
// 		li.appendChild(document.createTextNode(`${u.name} : ${u.email}`));
// 		userList.appendChild(li);
// 	}
// 	)
// };
