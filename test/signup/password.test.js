const chai = require('chai');

const invalidPw = 'Password does not meet requirements';

const noPassword = (app) => (done) => {
	chai
		.request(app)
		.post('/signup')
		.send({
			username: 'test',
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
			res.body.should.have.property('message').eql(invalidPw);
			done();
		});
};

const weakPassword = (app) => (done) => {
	chai
		.request(app)
		.post('/signup')
		.send({
			username: 'test',
			password: 'test@12',
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
			res.body.should.have.property('message').eql(invalidPw);
			done();
		});
};

module.exports = {
	weakPassword,
	noPassword
};
