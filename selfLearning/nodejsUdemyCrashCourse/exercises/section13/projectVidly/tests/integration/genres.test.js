const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');

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

	describe('GET /:id', () => {
		it('should return a genre if valid id is passed', async() => {
			const genre = new Genre({ typeOfGenre : 'Horror'});
			await genre.save();

			const res = await request(server).get('/api/genres/' + genre._id);
			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({ typeOfGenre: 'Horror' });
			expect(res.body).toMatchObject({ _id: genre._id.toString()});
		});

		it('should return a 404 if id is invalid', async() => {
			const res = await request(server).get('/api/genres/1');
			expect(res.status).toBe(404);
		});
	});

	describe('POST /', () => {
		it('should return 401 if client is not logged in', async() => {
			const res = await request(server)
			.post('/api/genres/')
			.send({ typeOfGenre: 'Horror' });

			expect(res.status).toBe(401);
		});

		it('should return 400 if typeOfGenre is less than 4 character', async() => {
			const token = new User().generateAuthToken();

			const res = await request(server)
			.post('/api/genres/')
			.set('x-auth-token', token)
			.send({ typeOfGenre: '124' });

			expect(res.status).toBe(400);
		});
	});
});