const {auth} = require('../../../middlewares/auth');
const {User} = require('../../../models/user');
const mongoose = require('mongoose');

describe('auth middleware', () => {
	it('should populate req.user with payload of valid json', async() => {
		const payload = {
					_id: new mongoose.Types.ObjectId().toHexString(),
					isAdmin: true
				};
		const token = new User({ _id: payload._id, isAdmin: payload.isAdmin }).generateAuthToken();
		const req = {
			header: jest.fn().mockReturnValue(token),
		};
		const res = {}
		const next = jest.fn();
		auth(req, res, next);
		expect(req.user).toMatchObject(payload);
		expect(next).toHaveBeenCalled();
	});
});