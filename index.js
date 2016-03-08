var cacheChain = require('cache-chain');

module.exports = function(client) {

	function backend(client) {

		this.set = function(key, value, options, cb) {
			client.set(key, JSON.stringify(value), 'PX', options.ttl, function(err, reply) {
				if(err) {
					cb(err);
				} else {
					cb(null, reply);
				}
			})
		};

		this.get = function(key, options, cb) {
			client.get(key, function(err, reply) {
				if(err) {
					cb(new cacheChain.error.failedToRefresh);
				} else if (reply === null) {
					cb(new cacheChain.error.notFound);
				} else {
					cb(null, JSON.parse(reply));
				}
			})
		};

		this.delete = function(key, options, cb) {
			client.del(key, function(err) {
				cb();
				if(err) {
					console.error(error);
				}
			});
		}
	}
	return new backend(client);
};
