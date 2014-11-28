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
				/*var best = 0;
				var scores = [];
				var action = { name: 'explore' };

				var visibleCells = this._actor.getVisibilityData().visibleCells;
				for (var key in visibleCells)
				{
					var currCell = this._map.getCells()[key];
					var actors = currCell.getActors();


					if ((currCell === this._actor.getCell() && actors.length > 1) || (currCell !== this._actor.getCell() && actors.length > 0))
					{
						var dist = this._actor.getDist(currCell);
						var currScore = 1 / dist;
						if (currScore > best)
						{
							best = currScore;
							action = { name: 'fight', target: currCell, dist: dist };
						}
					}
				}

				switch (action.name)
				{
					case 'fight':
						if (action.dist > 0) { this._controller.walkToward(this._actor, action.target); }
						else { console.log('fighting !!!!'); }
						break;

					case 'explore':
						this._actor.explore();
						break;
				}*/

				//this._actor.explore();
				this.dispatcher.fire('actComplete');

				this.dispatcher.fire('update');
				
				setTimeout(function () { resolve('ok !'); }, 1);

			}.bind(this));
			promise.then(function ($result) {

			}.bind(this), function ($rejection) {
				console.error($rejection.stack);
			});
			return promise;
		}
	};
});