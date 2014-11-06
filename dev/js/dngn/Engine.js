define(['ROT'],
	function (ROT) {
	'use strict';

	var Engine =
	{
		start: function ($player)
		{
			var scheduler = new ROT.Scheduler.Simple();
			scheduler.add($player, true);
			this.ROTEngine = new ROT.Engine(scheduler);
			this.unlock = this.ROTEngine.unlock.bind(this.ROTEngine);
			this.lock = this.ROTEngine.lock.bind(this.ROTEngine);
			this.ROTEngine.start();
		}
	};

	return Engine;
});