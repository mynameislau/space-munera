define(['event/Dispatcher'],
	function (Dispatcher) {
	'use strict';

	var Engine =
	{
		init: function () {
			this.dispatcher = Object.create(Dispatcher);
			return this;
		},
		start: function ()
		{
			this.delta = window.performance.now();
			var counter = 0;
			var loop = function ()
			{
				this.dispatcher.fire('loop', window.performance.now());
				window.requestAnimationFrame(loop);
			}.bind(this);
			loop();
		}
	};

	return Engine;
});