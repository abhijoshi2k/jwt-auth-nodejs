const chai = require('chai');

const invalidUsernameErr =
	'Username must be between 3 and 20 characters long and can only contain letters, numbers, underscores and periods.';

const noUsername = (app) => (done) => {
	chai
		.request(app)
		.post('/signup')
		.send({
			password: 'test@123TEST',
			email: 'testmail@test.com',
			contactNumber: '9898989898',
			role: 'user'
		})
		.end((err, res) => {
			res.should.have.status(400);
			res.body.should.be.a('object');
			res.body.should.not.have.property('refresh_token');
			res.body.should.not.have.property('access_token');
			res.body.should.have.property('status').eql(false);
			res.body.should.have
				.property('message')
				.eql('Path `username` is required.');
			done();
		});
};

const invalidChars = (app) => (done) => {
	chai
		.request(app)
		.post('/signup')
		.send({
			username: 'test+',
			password: 'test@123TEST',
			email: 'testmail@test.com',
			contactNumber: '9898989898',
			role: 'user'
		})
		.end((err, res) => {
			res.should.have.status(400);
			res.body.should.be.a('object');
			res.body.should.not.have.property('refresh_token');
			res.body.should.not.have.property('access_token');
			res.body.should.have.property('status').eql(false);
			res.body.should.have.property('message').eql(invalidUsernameErr);
			done();
		});
};

const shortUsername = (app) => (done) => {
	chai
		.request(app)
		.post('/signup')
		.send({
			username: 'te',
			password: 'test@123TEST',
			email: 'testmail@test.com',
			contactNumber: '9898989898',
			role: 'user'
		})
		.end((err, res) => {
			res.should.have.status(400);
			res.body.should.be.a('object');
			res.body.should.not.have.property('refresh_token');
			res.body.should.not.have.property('access_token');
			res.body.should.have.property('status').eql(false);
			res.body.should.have.property('message').eql(invalidUsernameErr);
			done();
		});
};

const longUsername = (app) => (done) => {
	chai
		.request(app)
		.post('/signup')
		.send({
			username:
				'tettttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
			password: 'test@123TEST',
			email: 'testmail@test.com',
			contactNumber: '9898989898',
			role: 'user'
		})
		.end((err, res) => {
			res.should.have.status(400);
			res.body.should.be.a('object');
			res.body.should.not.have.property('refresh_token');
			res.body.should.not.have.property('access_token');
			res.body.should.have.property('status').eql(false);
			res.body.should.have.property('message').eql(invalidUsernameErr);
			done();
		});
};

module.exports = {
	noUsername,
	invalidChars,
	shortUsername,
	longUsername
};
