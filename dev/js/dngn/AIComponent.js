define(['event/Dispatcher'],
	function (Dispatcher) {
	'use strict';

	return {
		init: function () {
			this.dispatcher = Object.create(Dispatcher);
			this.history = [];
			this.lastFarest = undefined;
			this.target = undefined;
			this.destination = undefined;
			return this;
		},

		setState: function ($state) {
			this._state = $state;
			this.dispatcher.fire('stateChanged');
		},
		getStateName: function () {
			return this._state.name;
		}
	};
});