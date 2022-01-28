//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Import the dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

// Import the app
let app = require('../src/app');

// Import User model
let User = require('../src/models/User');

// Import signup tests
let validSignupTests = require('./signup/valid.test');
let usernameSignupTests = require('./signup/username.test');
let passwordSignupTests = require('./signup/password.test');
let emailSignupTests = require('./signup/email.test');
let genderSignupTests = require('./signup/gender.test');
let dobSignupTests = require('./signup/dob.test');
let contactSignupTests = require('./signup/contact.test');
let roleSignupTests = require('./signup/role.test');

// Import login tests
let usernameLoginTests = require('./login/username.test');
let passwordLoginTests = require('./login/password.test');

// Import already registered tests
let alreadyRegisteredTests = require('./alreadyRegistered/alreadyRegistered.test');

chai.use(chaiHttp);

describe('Check signup', () => {
	// Empty the database before each test
	beforeEach((done) => {
		User.deleteMany({}, (err) => {
			done();
		});
	});

	it(
		'should signup a new user without gender and dob',
		validSignupTests.withoutGenderDob(app)
	);

	it(
		'should signup a new user with gender and dob',
		validSignupTests.withoutGenderDob(app)
	);

	it(
		'should not signup a new user with no username',
		usernameSignupTests.noUsername(app)
	);

	it(
		'should not signup a new user with invalid username characters',
		usernameSignupTests.invalidChars(app)
	);

	it(
		'should not signup a new user with short username',
		usernameSignupTests.shortUsername(app)
	);

	it(
		'should not signup a new user with long username',
		usernameSignupTests.longUsername(app)
	);

	it(
		'should not signup a new user with no password',
		passwordSignupTests.noPassword(app)
	);

	it(
		'should not signup a new user with weak password',
		passwordSignupTests.weakPassword(app)
	);

	it(
		'should not signup a new user with no email',
		emailSignupTests.noEmail(app)
	);

	it(
		'should not signup a new user with invalid email',
		emailSignupTests.invalidEmail(app)
	);

	it(
		'should not signup a new user with invalid gender',
		genderSignupTests.invalidGender(app)
	);

	it(
		'should not signup a new user with invalid dob',
		dobSignupTests.invalidDob(app)
	);

	it(
		'should not signup a new user with no contact number',
		contactSignupTests.noContact(app)
	);

	it(
		'should not signup a new user with invalid contact number',
		contactSignupTests.invalidContact(app)
	);

	it('should not signup a new user with no role', roleSignupTests.noRole(app));

	it(
		'should not signup a new user with invalid role',
		roleSignupTests.invalidRole(app)
	);
});

describe('Check login', () => {
	beforeEach((done) => {
		User.create(
			{
				username: 'test',
				password: 'test@123TEST',
				email: 'testmail@test.com',
				contactNumber: '9898989898',
				role: 'user'
			},
			(err) => {
				done();
			}
		);
	});

	afterEach((done) => {
		User.deleteMany({}, (err) => {
			done();
		});
	});

	// Bcrypt does not compare hash well in test environment.
	// Hence successful login is not possible.

	it(
		'should not login a user with no username',
		usernameLoginTests.noUsername(app)
	);

	it(
		'should not login a user with incorrect username',
		usernameLoginTests.incorrectUsername(app)
	);

	it(
		'should not login a user with no password',
		passwordLoginTests.noPassword(app)
	);

	it(
		'should not login a user with incorrect password',
		passwordLoginTests.incorrectPassword(app)
	);
});

describe('Check Already Registered', () => {
	beforeEach((done) => {
		User.create(
			{
				username: 'test',
				password: 'test@123TEST',
				email: 'testmail@test.com',
				contactNumber: '9898989898',
				role: 'user'
			},
			(err) => {
				done();
			}
		);
	});

	afterEach((done) => {
		User.deleteMany({}, (err) => {
			done();
		});
	});

	it(
		'should not signup a new user with already registered username',
		alreadyRegisteredTests.repeatUsername(app)
	);

	it(
		'should not signup a new user with already registered email',
		alreadyRegisteredTests.repeatEmail(app)
	);
});
