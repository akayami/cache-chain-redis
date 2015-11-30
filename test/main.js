var redis = require('redis');
var cc = require('cache-chain');

describe('Main Tests for cache-chain-redis', function() {

	var chain;

	beforeEach(function() {
		chain = cc.chain({
			ttl: 10000,
			stale: 10000 * 2
		});
		var client = redis.createClient();
		var layer = cc.layer(require('../index.js')(client));
		chain.append(layer);
	});

	it('It needs to set a value', function(done) {
		var key = 'key';
		var value = 'value';
		chain.set(key, value, function(err, reply) {
			if (err) {
				done(err);
			} else {
				done();
			}
		})
	});

	it('It needs to retrive a set value', function(done) {
		var key = 'key';
		var value = 'value';
		chain.set(key, value, function(err, reply) {
			if (err) {
				done(err);
			} else {
				chain.get(key, function(err, reply) {
					if (err) {
						done(err);
					} else {
						if (reply == value) {
							done();
						} else {
							done(reply)
						}
					}
				})
			}
		})
	});

	it('It needs to delete a set value', function(done) {
		var key = 'key';
		var value = 'value';
		chain.set(key, value, function(err, reply) {
			if (err) {
				done(err);
			} else {
				chain.delete(key, function(err) {
					if (err) {
						cb(err);
					} else {
						chain.get(key, function(err, reply) {
							if (err) {
								if (err.message == "Key not found") {
									done();
								} else {
									done('Wrong error message returned');
								}
							} else {
								done('Expected error message. Got correct reply instead')
							}
						})
					}
				})
			}
		})
	});

	it('A value needs to timeout', function(done) {
		var key = 'key';
		var value = 'value';
		chain.set(key, value, {
			ttl: 10,
			stale: 5
		}, function(err, reply) {
			if (err) {
				done(err);
			} else {
				setTimeout(function() {
					chain.get(key, function(err, reply) {
						if (err) {
							if (err.message == "Key not found") {
								done();
							} else {
								done('Wrong error message returned');
							}
						} else {
							done('Expected error message. Got correct reply instead')
						}
					})
				}, 15);
			}
		})
	});
});
