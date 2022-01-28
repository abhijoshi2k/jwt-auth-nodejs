const chai = require('chai');

const withoutGenderDob = (app) => (done) => {
	chai
		.request(app)
		.post('/signup')
		.send({
			username: 'test',
			password: 'test@123TEST',
			email: 'testmail@test.com',
			contactNumber: '9898989898',
			role: 'user'
		})
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('refresh_token');
			res.body.should.have.property('access_token');
			res.body.should.have.property('status').eql(true);
			res.body.should.have.property('message').eql('Signup Successful');
			done();
		});
};

const withGenderDob = (app) => (done) => {
	chai
		.request(app)
		.post('/signup')
		.send({
			username: 'test',
			password: 'test@123TEST',
			email: 'testmail@test.com',
			contactNumber: '9898989898',
			gender: 'male',
			dateOfBirth: '19 January 2000',
			role: 'user'
		})
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('refresh_token');
			res.body.should.have.property('access_token');
			res.body.should.have.property('status').eql(true);
			res.body.should.have.property('message').eql('Signup Successful');
			done();
		});
};

module.exports = {
	withoutGenderDob,
	withGenderDob
};
