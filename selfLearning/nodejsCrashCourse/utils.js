function generateRandomNumber (){
	return Math.floor(Math.random() * 100 +  Math.random()* 10);
}

function celciusToFahrenheit(celcius){
	return (celcius * 9) / 5 + 32;
}

// // Default export
// // Single
// module.exports = generateRandomNumber;

// //Multiple
// module.exports = {
// 	generateRandomNumber,
// 	celciusToFahrenheit
// };
