const request = require('supertest');
const auth = require('../../../middlewares/auth');
const {User} = require('../../../models/user');

describe('auth middleware', () => {
	let token;

	beforeEach( () => {
		server = require('../../../app')
	});
 	afterEach( async() => {
		// await server.close();
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
});