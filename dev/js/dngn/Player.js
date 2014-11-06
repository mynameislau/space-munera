define(['dngn/Pathfinder'],
	function (Pathfinder) {
	'use strict';

	return {
		init: function ($engine, $map)
		{
			this.engine = $engine;
			this.map = $map;
			this.loop = 0;
			this.lives = 3;
			this.history = {};
			this.lastFarest = undefined;
			this.lastCell = undefined;
		},
		setCell: function ($cell)
		{
			this.cell = $cell;
		},
		act: function () {
			var promise = new Promise(function (resolve) {
				var visibilityData = this.map.getVisibilityData(this.cell.getKey());
				var getDist = function ($cell1, $cell2)
				{
					var xDist = Math.abs($cell1.getX() - $cell2.getX());
					var yDist = Math.abs($cell1.getY() - $cell2.getY());
					return Math.sqrt(Math.pow(xDist, 2), Math.pow(yDist, 2));
				};
				for (var key in this.map.getCells())
				{
					var currCell = this.map.getCells();
					if (!this.history[key] && visibilityData.visibleCells[key])
					{
						this.history[key] = Infinity;
					}
					else if (this.history[key] === Infinity)
					{
						this.history[key] = 1;
					}
					else if (this.history[key])
					{
						this.history[key] += 1;
					}

				}
				/*for (var key in visibilityData.visibleCells)
				{
					if (!this.history[key]) { this.history[key] = Infinity; }
					else if (this.history[key] === Infinity) { this.history[key] = 1; }
					this.history[key] *= 2;
					console.log(this.history[key]);
				}*/
				var farestWalkables = visibilityData.farestWalkables;
				var destination;
				var path;
				
				var best;
				for (var i = 0, farestLength = farestWalkables.length; i < farestLength; i += 1)
				{
					var currFarest = farestWalkables[i];
					
					var hyp = this.lastFarest ? getDist(currFarest, this.lastFarest) * 10 : 0;
					var dist = getDist(this.cell, currFarest) * 10;
					var hist = this.history[currFarest.getKey()] * 10;
					var score = dist + hist - hyp;
					
					score = 0;
					path = Pathfinder.compute(this.map, this.cell, currFarest);
					if (this.lastCell) { console.log(path[0].getKey(), this.lastCell.getKey(), path[0] === this.lastCell); }
					if (path[0] === this.lastCell)
					{
						score -= 1;
					}

					if (score > best || !best)
					{
						best = score;
						destination = currFarest;
					}
				}
				//debugger;
				this.lastFarest = destination;
				path = Pathfinder.compute(this.map, this.cell, destination);
				this.lastCell = this.cell;
				this.map.moveActorToCell(this.cell, path[1]);
				if (this.actCallback) { this.actCallback(); }
				setTimeout(function () { resolve('ok !'); }, 1000);
			}.bind(this));
			promise.then(function (result) {

			}.bind(this));
			return promise;
		}
	};
});