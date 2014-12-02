define(['dngn/Pathfinder', 'dngn/Actor', 'event/Dispatcher', 'dngn/AIComponent'],
	function (Pathfinder, Actor, Dispatcher, AIComponent) {
	'use strict';

	return {
		init: function ($map)
		{
			this.mutationComp = { strength: 100, speed: 100 };
			this.AIComp = Object.create(AIComponent).init();
			this.mapComp = $map;
			this.posComp = { cell: undefined };
			this.fightingComp = { target: undefined };
			
			this.dispatcher = Object.create(Dispatcher);

			return this;
		},
		act: function () {
			var promise = new Promise(function (resolve, reject)
			{
				this.dispatcher.fire('update');
				
				setTimeout(function () { resolve('ok !'); }, 1000);

			}.bind(this));
			promise.then(function ($result) {

			}.bind(this), function ($rejection) {
				console.error($rejection.stack);
			});
			return promise;
		}
	};
});