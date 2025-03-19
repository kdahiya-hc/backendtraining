const exercise1 = require('../exercise1.js');

describe('fizzBuzz', () => {
	it('should throw an error if input is not a number', () => {
		const args = [null, undefined, ''];
		args.forEach( (a) => {
			expect(() => { exercise1.fizzBuzz(a)}).toThrow();
		})
	});

	it('should return fizzBuzz if input is divisible by 3 and 5', () => {
		const args = [15, 30];
		args.forEach( (a) => {
			const result = exercise1.fizzBuzz(a);
			expect(result).toBe('FizzBuzz');
		})
	});
	it('should return fizz if input is divisible by 3', () => {
		const args = [6, 12];
		args.forEach( (a) => {
			const result = exercise1.fizzBuzz(a);
			expect(result).toBe('Fizz');
		})
	});

	it('should return fizz if input is divisible by 3', () => {
		const args = [20, 10];
		args.forEach( (a) => {
			const result = exercise1.fizzBuzz(a);
			expect(result).toBe('Buzz');
		})
	});
})