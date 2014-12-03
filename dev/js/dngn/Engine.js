define(['ROT'],
	function (ROT) {
	'use strict';

	var Engine =
	{
		init: function () {
			this._scheduler = new ROT.Scheduler.Simple();
			this._ROTEngine = new ROT.Engine(this._scheduler);
		},
		start: function ()
		{
			this._ROTEngine.start();
		},
		add: function ($actor)
		{
			this._scheduler.add($actor, true);
		},
		remove: function ($actor)
		{
			this._scheduler.remove($actor);
		}
	};

	return Engine;
});