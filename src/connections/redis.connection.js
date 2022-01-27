// Import installed packages
const { createClient } = require('redis');

// Add dev prefix if environment is not production
const prefix = process.env.NODE_ENV === 'production' ? '' : 'dev_';

// Create redis client
const client = createClient({
	url: process.env.REDIS_URL
});

// Add client listenters

client.on('connect', () => {
	client.connected = true;
	console.log('Connected to Redis');
});

client.on('error', (err) => {
	client.connected = false;
	console.log('Redis Error');
	console.log(err);
});

// Connect to client
client.connect();

// Get data from redis
async function getKey(key) {
	try {
		let keyData = await client.get(prefix + key);
		return keyData ? JSON.parse(keyData) : false;
	} catch (e) {
		console.log(e);
		return false;
	}
}

// Set data in redis
async function setKey(key, value, ttl) {
	try {
		await client.setEx(prefix + key, ttl, JSON.stringify(value));
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}

// Delete data from redis
async function delKey(key) {
	try {
		await client.del(prefix + key);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}

module.exports = { setKey, getKey, delKey };
