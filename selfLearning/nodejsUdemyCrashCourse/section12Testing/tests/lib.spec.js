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
		expect(result).toEqual(expect.objectContaining({ id: 1})); // Works as it checks one
		expect(result).toMatchObject({ id: 1});
		expect(result).toEqual({ id: 1}); // Deep equality needed
	});
})