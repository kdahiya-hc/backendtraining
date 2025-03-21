const request = require('supertest');
const {Genre} = require('../../models/genre');
let server;

describe('/api/genres', () => {
	beforeEach( () => {
		server = require('../../index');
	});
	afterEach( async() => {
		await server.close();
		await Genre.deleteMany({});
	});

	describe('GET /', () => {
		it('should return all genres', async() => {
			await Genre.collection.insertMany([
				{ typeOfGenre: 'Horror'},
				{ typeOfGenre: 'Romance'},
			]);
			const res = await request(server).get('/api/genres');
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some((g)=> { return g.typeOfGenre === 'Horror'})).toBeTruthy();
			expect(res.body.some((g)=> { return g.typeOfGenre === 'Romance'})).toBeTruthy();
		});
	});
});