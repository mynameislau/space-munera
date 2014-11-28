define(['dngn/Pathfinder'],
	function (Pathfinder) {
	'use strict';

	return {
		init: function ($map)
		{
			this._map = $map;
		},
		getVisibilityData: function ()
		{
			return this._map.getVisibilityData(this._cell.key);
		},
		getDist: function ($cell)
		{
			return this._map.getDist(this._cell, $cell);
		},
		explore: function ()
		{
			this._lastFarest = this._lastFarest || undefined;
			this._history = this._history || {};
			//this.lastCell = undefined;

			var visibilityData = this.getVisibilityData();
			var farestWalkables = visibilityData.farestWalkables;
			var visibleCells = visibilityData.visibleCells;
			
			var key;
			for (var i = 0, length = this._map.getCellsArray().length; i < length; i += 1)
			{
				var currCell = this._map.getCellsArray()[i];
				key = currCell.key;
				var history = this._history[key];
				var visible = visibleCells[key];
				var farest = farestWalkables[key];

				if (!history && farest)
				{
					this._history[key] = Infinity;
				}
				else if (visible && !farest)
				{
					this._history[key] = 1;
				}
				else if (history)
				{
					this._history[key] += 1;
				}
			}
			
			var destination;
			var best;
			
			i = 0;
			length = farestWalkables.length;
			for (i = 0; i < length; i += 1)
			{
				var currFarest = farestWalkables[i];
				key = currFarest.key;
				
				//calcul bien foireux
				var lastGoalDist = this._lastFarest ? this._map.getDist(currFarest, this._lastFarest) * 10 : 0;
				var distToGoal = this._map.getDist(this._cell, currFarest) * 10;
				var hist = this._history[key] * 10;
				var score = distToGoal + hist - lastGoalDist;
				
				/* n'aime pas revenir sur ses pas...
				path = Pathfinder.compute(this._map, this._cell, currFarest);
				// if (this.lastCell) { console.log(path[1].key, this.lastCell.key, path[1] === this.lastCell); }
				if (path[1] === this.lastCell) { score *= 0.4; }*/

				if (score > best || !best)
				{
					best = score;
					destination = currFarest;
				}
			}
			//debugger;
			this._lastFarest = destination;
			this.walkToward(destination);
		},
		walkToward: function ($destination)
		{
			var path = Pathfinder.compute(this._map, this._cell, $destination);
			//this.lastCell = this._cell;
			if (path.length > 0)
			{
				this._map.addActorToCell(path[1], this);
				return true;
			}
			return false;
		},
		getCell: function ()
		{
			return this._cell;
		},
		setCell: function ($cell)
		{
			this._cell = $cell;
		}
	};
});