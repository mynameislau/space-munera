define([],
	function () {
	'use strict';

	return function ($entity)
	{
		var map = $entity.mapComp;
		var actorCell = $entity.posComp.cell;
		var lastFarest = $entity.AIComp.lastFarest;
		var history = $entity.AIComp.history;
		//console.log(history);

		//this.lastCell = undefined;

		var visibilityData = map.getVisibilityData(actorCell.getKey());
		var farestWalkables = visibilityData.farestWalkables;
		var visibleCells = visibilityData.visibleCells;
		
		var key;
		for (var i = 0, length = map.getCellsArray().length; i < length; i += 1)
		{
			var currCell = map.getCellsArray()[i];
			key = currCell.getKey();
			var cellHistory = history[key];
			var visible = visibleCells[key];
			var farest = farestWalkables[farestWalkables.indexOf(key)];

			if (!cellHistory && farest)
			{
				history[key] = Infinity;
			}
			else if (visible && !farest)
			{
				history[key] = 1;
			}
			else if (cellHistory)
			{
				history[key] += 1;
			}
		}
		
		var destination;
		var best;
		
		i = 0;
		length = farestWalkables.length;
		for (i = 0; i < length; i += 1)
		{
			key = farestWalkables[i];
			var farestCell = map.getCell(key);
			
			//calcul bien foireux
			var lastGoalDist = lastFarest ? map.getDist(farestCell, lastFarest) * 10 : 0;
			var distToGoal = map.getDist(actorCell, farestCell) * 10;
			var hist = history[key] * 10;
			var score = distToGoal + hist - lastGoalDist;
			
			/* n'aime pas revenir sur ses pas...
			path = Pathfinder.compute(map, actorCell, currFarest);
			// if (this.lastCell) { console.log(path[1].getKey(), this.lastCell.getKey(), path[1] === this.lastCell); }
			if (path[1] === this.lastCell) { score *= 0.4; }*/

			if (score > best || !best)
			{
				best = score;
				destination = farestCell;
			}
		}
		//debugger;
		lastFarest = destination;
		$entity.AIComp.destination = destination;

		$entity.AIComp.setState({ name: 'explore' });
	};
});