var redis = require('redis');

describe('Main Tests for cache-chain-redis', function() {

	var di = {
		chain: null,
		cc: require('cache-chain')
	}

	beforeEach(function(done) {
		di.chain = di.cc.chain({
			ttl: 10000,
			stale: 10000 * 2
		});
		var client = redis.createClient();
		var layer = di.cc.layer(require('../index.js')(client));
		di.chain.append(layer);
		done();
	});

	require('cache-chain/test/integration')(di);

});
