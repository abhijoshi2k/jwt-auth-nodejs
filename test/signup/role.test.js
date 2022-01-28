const chai = require('chai');

const noRole = (app) => (done) => {
	chai
		.request(app)
		.post('/signup')
		.send({
			username: 'test',
			password: 'test@123TEST',
			email: 'testmail@test.com',
			contactNumber: '9898989898'
		})
		.end((err, res) => {
			res.should.have.status(400);
			res.body.should.be.a('object');
			res.body.should.not.have.property('refresh_token');
			res.body.should.not.have.property('access_token');
			res.body.should.have.property('status').eql(false);
			res.body.should.have.property('message').eql('Path `role` is required.');
			done();
		});
};

const invalidRole = (app) => (done) => {
	chai
		.request(app)
		.post('/signup')
		.send({
			username: 'test',
			password: 'test@123TEST',
			email: 'testmail@test.com',
			contactNumber: '9898989898',
			role: 'invalid'
		})
		.end((err, res) => {
			res.should.have.status(400);
			res.body.should.be.a('object');
			res.body.should.not.have.property('refresh_token');
			res.body.should.not.have.property('access_token');
			res.body.should.have.property('status').eql(false);
			res.body.should.have
				.property('message')
				.eql('`invalid` is not a valid enum value for path `role`.');
			done();
		});
};

module.exports = {
	noRole,
	invalidRole
};
