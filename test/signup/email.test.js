const chai = require('chai');

const noEmail = (app) => (done) => {
	chai
		.request(app)
		.post('/signup')
		.send({
			username: 'test',
			password: 'test@123TEST',
			contactNumber: '9898989898',
			role: 'user'
		})
		.end((err, res) => {
			res.should.have.status(400);
			res.body.should.be.a('object');
			res.body.should.not.have.property('refresh_token');
			res.body.should.not.have.property('access_token');
			res.body.should.have.property('status').eql(false);
			res.body.should.have.property('message').eql('Path `email` is required.');
			done();
		});
};

const invalidEmail = (app) => (done) => {
	chai
		.request(app)
		.post('/signup')
		.send({
			username: 'test',
			password: 'test@123TEST',
			email: 'testmail@test',
			contactNumber: '9898989898',
			role: 'user'
		})
		.end((err, res) => {
			res.should.have.status(400);
			res.body.should.be.a('object');
			res.body.should.not.have.property('refresh_token');
			res.body.should.not.have.property('access_token');
			res.body.should.have.property('status').eql(false);
			res.body.should.have.property('message').eql('Invalid email address.');
			done();
		});
};

module.exports = {
	noEmail,
	invalidEmail
};
