var syn = syn || (function(WS) {
	if (WS === null) 
		throw {
			name: 'WebSocket Error',
			message: 'Your browser does not support the function. Please use chrome.'
		}

	var instance,

		subscribers = {
			'open': [],
			'message': [],
			'close': []
		},

		connect = function(server) {
			instance = new WS(server);
			for (var type in subscribers) {
				if (subscribers.hasOwnProperty(type)) {
					instance['on' + type] = (function(type) {
						return function(event) {
							var i = 0, callbacks = subscribers[type], len = callbacks.length;
							for (; i < len; i++) {
								callbacks[i].call(instance, event);
							}
						}
					})(type);
				}
			}

			connect = function() {
				return instance;
			};

			return this;
		},

		getInstance = function() {
			if (typeof instance === 'undefined') {
				throw {
					name: 'WebSocket errer',
					message: 'Invoke syn.connect(server) first'
				}
			}
			return instance;
		},

		on = function(type, callback) {
			if (subscribers[type]) {
				subscribers[type].push(callback);
			}
			return this;
		},

		send = function(data) {
			if (instance) {
				instance.send(data);
			}
			return this;
		};

	return {
		connect: connect,
		getInstance: getInstance,
		on: on,
		send: send
	};

})(('WebSocket' in window) ? WebSocket : null);