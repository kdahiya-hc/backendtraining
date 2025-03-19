const lib = require('../lib.js');
const db = require('../db.js');
const mail = require('../mail.js');

describe('absolute', () => {
	it('absolute - should return a positive number: when input is positive', () => {
		const result = lib.absolute(1);
		expect(result).toBe(1);
	});

	it('absolute - should return a positive number: when input is negative', () => {
		const result = lib.absolute(-1);
		expect(result).toBe(1);
	});

	it('absolute - should return a zero number: when input is zero', () => {
		const result = lib.absolute(0);
		expect(result).toBe(0);
	});
})

describe('greet', () => {
	it('should return the greeting msg', () => {
		const result = lib.greet('KISHu!');
		expect(result).toMatch(/kishu/i);
	});
})

describe('getCurrencies', () => {
	it('should return supported currencies', () => {
		const result = lib.getCurrencies();

		// // general tests
		// expect(result).toBeDefined();
		// expect(result).not.toBeNull();

		// // specific tests
		// expect(result[0]).toBe('USD');
		// expect(result[1]).toBe('AUD');
		// expect(result[2]).toBe('EUR');
		// expect(result.length).toBe(3);

		// // proper tests kinda?
		// expect(result).toContain('USD');
		// expect(result).toContain('AUD');
		// expect(result).toContain('EUR');

		// ideal way
		expect(result).toMatchObject(expect.arrayContaining(['USD','EUR','AUD']));
		expect(result).toEqual(expect.arrayContaining(['USD','EUR','AUD']));
	})
})

describe('getProduct', () => {
	it('should return product with given id', () => {
		const result = lib.getProduct(1);
		expect(result).toEqual(expect.objectContaining({ id: 1 })); // Works as it checks one
		expect(result).toMatchObject({ id: 1 });
		// expect(result).toEqual({ id: 1 }); // Deep equality needed
		expect(result).toHaveProperty('id',1);
	});
})

describe('registerUser', () => {
	it('should throw if username is falsy', () => {
		// // const result = lib.registerUser(null	); // This doesnt return a value as username is not provided
		// expect(() => {lib.registerUser(false)}).toThrow();
		// expect(() => {lib.registerUser('')}).toThrow();
		// expect(() => {lib.registerUser(null)}).toThrow();
		// expect(() => {lib.registerUser(x)}).toThrow();
		// expect(() => {lib.registerUser(Nan)}).toThrow();
		// expect(() => {lib.registerUser(0)}).toThrow();

		// run paramaterized test
		const args = [null, undefined, 0, false, '', NaN];
		args.forEach( (a) => {
			expect(() => { lib.registerUser(a) }).toThrow();
		});
	});

	it('should throw return user object if username is valid', () => {
		const result = lib.registerUser('kishan');
		expect(result).toMatchObject({ username: 'kishan' });
		expect(result.id).toBeGreaterThan(0);
	});
})

// Mock function to write unit test for function that have external dependencies
// We can write a mock which sends value withoit having the external dependency available,
// replicating its behaviour

// Below module function has only one external dependency which has no other dependencies in itself
describe('applyDiscount', () => {
	it('should not apply discount when customer has less than 10 points', () => {
		// Mock Function 1
		db.getCustomerSync = function(customerId){
			console.log('Fake reading customer points for Id');
			return ({ points: 4 });
		}

		const order = { customerId: 1, totalPrice: 10 };
		lib.applyDiscount(order);
		expect(order.totalPrice).toBe(10);
	});

	it('should apply 10% discount when customer has more than 10 points', () => {
		//Mock Function 2
		db.getCustomerSync = function(customerId){
			console.log('Fake reading customer points for Id');
			return ({ points: 12 });
		}

		const order = { customerId: 1, totalPrice: 10 };
		lib.applyDiscount(order);
		expect(order.totalPrice).toBe(9);
	});
})

describe('notifyCustomer', () => {
	it('should send an email to the customer when order is placed', () => {
		db.getCustomerSync = function (customerId) {
			return ({ email: 'test@rest.com' });
		}

		let mailSent = false;
		mail.send = function(email, message){
			mailSent = true
		}

		const order = { customerId: 1, totalPrice: 10 };
		lib.notifyCustomer(order);
		expect(mailSent).toBe(true);
	});
})