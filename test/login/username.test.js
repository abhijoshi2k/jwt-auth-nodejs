const chai = require('chai');

const noUsername = (app) => (done) => {
	chai
		.request(app)
		.post('/login')
		.send({
			password: 'test@123TEST'
		})
		.end((err, res) => {
			res.should.have.status(400);
			res.body.should.be.a('object');
			res.body.should.not.have.property('refresh_token');
			res.body.should.not.have.property('access_token');
			res.body.should.have.property('status').eql(false);
			res.body.should.have.property('message').eql('Invalid Credentials.');
			done();
		});
};

const incorrectUsername = (app) => (done) => {
	chai
		.request(app)
		.post('/login')
		.send({
			username: 'invalid',
			password: 'test@123TEST'
		})
		.end((err, res) => {
			res.should.have.status(401);
			res.body.should.be.a('object');
			res.body.should.not.have.property('refresh_token');
			res.body.should.not.have.property('access_token');
			res.body.should.have.property('status').eql(false);
			res.body.should.have.property('message').eql('Invalid Credentials.');
			done();
		});
};

module.exports = {
	noUsername,
	incorrectUsername
};
