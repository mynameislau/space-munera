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
		add: function ($player)
		{
			this._scheduler.add($player, true);
		}
	};

	return Engine;
});