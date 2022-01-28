const chai = require('chai');

const repeatUsername = (app) => (done) => {
	chai
		.request(app)
		.post('/signup')
		.send({
			username: 'test',
			password: 'test@123TEST',
			email: 'testmail2@test.com',
			contactNumber: '9898989898',
			role: 'user'
		})
		.end((err, res) => {
			res.should.have.status(409);
			res.body.should.be.a('object');
			res.body.should.not.have.property('refresh_token');
			res.body.should.not.have.property('access_token');
			res.body.should.have.property('status').eql(false);
			res.body.should.have.property('message').eql('User already registered');
			done();
		});
};

const repeatEmail = (app) => (done) => {
	chai
		.request(app)
		.post('/signup')
		.send({
			username: 'test2',
			password: 'test@123TEST',
			email: 'testmail@test.com',
			contactNumber: '9898989898',
			role: 'user'
		})
		.end((err, res) => {
			res.should.have.status(409);
			res.body.should.be.a('object');
			res.body.should.not.have.property('refresh_token');
			res.body.should.not.have.property('access_token');
			res.body.should.have.property('status').eql(false);
			res.body.should.have.property('message').eql('User already registered');
			done();
		});
};

module.exports = {
	repeatUsername,
	repeatEmail
};
