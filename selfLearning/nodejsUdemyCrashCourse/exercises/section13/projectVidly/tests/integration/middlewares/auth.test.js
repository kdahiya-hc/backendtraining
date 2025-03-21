const request = require('supertest');
const auth = require('../../../middlewares/auth');
const {Genre} = require('../../../models/genre');
const {User} = require('../../../models/user');

describe('auth middleware', () => {
	let token;

	beforeEach( () => {
		server = require('../../../app')
	});
 	afterEach( async() => {
		// await server.close();
		await Genre.deleteMany({});
	});

	const exec = () => {
		return request(server)
			.post('/api/genres')
			.set('x-auth-token', token)
			.send({typeOfGenre: 'Testing'})
	}

	beforeEach( () => {
		token = new User().generateAuthToken();
	});

	it('should return 401 if no token is provided', async() => {
		token = '';
		const res = await exec();
		expect(res.status).toBe(401);
	});

	it('should return 400 if token is invalid', async() => {
		token = 'a';
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it('should return 201 if token is valid', async() => {
		const res = await exec();
		expect(res.status).toBe(201);
	});
});