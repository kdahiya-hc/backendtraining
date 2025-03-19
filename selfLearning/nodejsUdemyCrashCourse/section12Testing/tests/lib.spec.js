const lib = require('../lib');

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
		})
	});

	it('should throw return user object if username is valid', () => {
		const result = lib.registerUser('kishan');
		expect(result).toMatchObject({ username: 'kishan' });
		expect(result.id).toBeGreaterThan(0);
	});
})