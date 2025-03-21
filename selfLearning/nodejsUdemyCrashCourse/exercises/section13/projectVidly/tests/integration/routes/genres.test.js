const request = require('supertest');
const {Genre} = require('../../../models/genre');
const {User} = require('../../../models/user');

let server;

describe('/api/genres', () => {
	beforeEach( () => {
		server = require('../../../index');
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
		let token;
		let typeOfGenre;

		const exec = async() => {
			return await request(server)
			.post('/api/genres/')
			.set('x-auth-token', token)
			.send({ typeOfGenre });
		}

		beforeEach(() => {
			token = new User().generateAuthToken();
			typeOfGenre = 'testing';
		})
		it('should return 401 if client is not logged in', async() => {
			token = '';

			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if typeOfGenre is less than 4 character', async() => {
			typeOfGenre = '123'

			const res = await exec();

			expect(res.status).toBe(400);
		});

		it('should return 400 if typeOfGenre is more than 50 character', async() => {
			typeOfGenre = new Array(52).join('a');

			const res = await exec();

			expect(res.status).toBe(400);
		});

		it('should save genre if typeOfGenre is valid', async() => {
			const res = await exec();

			expect(res.status).toBe(201);
			const genre = await Genre.findOne({ typeOfGenre: typeOfGenre });
			expect(genre).not.toBeNull();
		});

		it('should return genre if typeOfGenre is valid', async() => {
			const res = await exec();

			expect(res.body).toHaveProperty('genre');
			expect(res.body.genre).toHaveProperty('typeOfGenre', typeOfGenre);
			expect(res.body.genre).toHaveProperty('_id');
		});
	});
});