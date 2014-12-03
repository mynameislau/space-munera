define(['dngn/Pathfinder', 'dngn/Actor', 'event/Dispatcher', 'dngn/AIComponent', 'dngn/VitalsComponent'],
	function (Pathfinder, Actor, Dispatcher, AIComponent, VitalsComponent) {
	'use strict';

	return {
		init: function ($map)
		{
			this.mutationComp = { strength: 100, speed: 100 };
			this.AIComp = Object.create(AIComponent).init();
			this.mapComp = $map;
			this.posComp = { cell: undefined };
			this.fightingComp = { target: undefined };
			this.vitalsComp = Object.create(VitalsComponent).init();
			this.abilitiesComp = { sight: 10, strength: 5 + Math.random() * 5 };
			
			this.dispatcher = Object.create(Dispatcher);

			return this;
		},
		act: function () {
			var promise = new Promise(function (resolve, reject)
			{
				this.dispatcher.fire('update', this);
				
				setTimeout(function () { resolve('ok !'); }, 100);

			}.bind(this));
			promise.then(function ($result) {

			}.bind(this), function ($rejection) {
				console.error($rejection.stack);
			});
			return promise;
		}
	};
});