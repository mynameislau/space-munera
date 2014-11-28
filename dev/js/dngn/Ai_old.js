define([],
	function () {
	'use strict';

	return function ($entity)
	{
		var AIComp = $entity.AIComp;
		var map = $entity.mapComp;
		var oldData = AIComp.history;
		var oldDestination = AIComp.destination;
		var selfCell = $entity.posComp.cell;
		var newCellScores = [];
		var visibilityData = map.getVisibilityData($entity.posComp.cell.getKey());
		var isNew = function ($key)
		{
			for (var k = 0, oldDataLength = oldData.length; k < oldDataLength; k += 1)
			{
				if (oldData[k].key === $key) { return false; }
			}
			return true;
		};
		
		for (var key in visibilityData.visibleCells)
		{
			if (isNew(key)) { newCellScores.push({ key: key }); }
		}
		var newData = oldData.concat(newCellScores);
		var isKnown = function ($key)
		{
			for (var k = 0, newDataLength = newData.length; k < newDataLength; k += 1)
			{
				if (newData[k].key === $key) { return true; }
			}
			return false;
		};

		var scores = [];

		var highest;
		//console.log(newData);

		var isEdge = function ($cell)
		{
			if ($cell.lightPasses())
			{
				var neighbours = map.getNeighbours($cell);
				for (var i = 0, length = neighbours.length; i < length; i += 1)
				{
					var currNeighbour = neighbours[i];
					if (isKnown(currNeighbour.getKey()) === false) { return true; }
				}
			}
		};

		for (var i = 0, dataLength = newData.length; i < dataLength; i += 1)
		{
			var currScore = newData[i];
			key = currScore.key;
			var currCell = map.getCell(key);
			if (currCell.isWalkable())
			{
				var newCell = oldData.indexOf(currScore) === -1;
				var rediscovered = !newCell && visibilityData.visibleCells[key];
				var isSelf = selfCell === currCell;
				var explo = 0;

				if (isEdge(currCell))
				{
					explo = 1000;
				}
				else if (rediscovered)
				{
					explo = 1;
				}
				else
				{
					explo = Math.min(1000, explo + 1);
				}

				//currScore.exploration -= oldDestination ? map.getDist(oldDestination, currCell) : 0;

				if (isSelf) { explo = Number.NEGATIVE_INFINITY; }

				var distance = map.getDist(currCell, selfCell);

				/*var lastGoalDist = oldDestination ? map.getDist(oldDestination, currCell) * 10 : 0;
				var distToGoal = map.getDist(selfCell, currCell) * 10;
				hist = hist * 10;
				currScore.exploration = distToGoal + hist - lastGoalDist;*/
				currScore.exploration = explo - distance;
				//console.log(currScore.exploration);
				
				//console.log(currScore.exploration, key, isEdge(currCell), isSelf, rediscovered);
				highest = (!highest || currScore.exploration > highest.exploration) ? currScore : highest;
			}
		}

		$entity.AIComp.destination = map.getCell(highest.key);
		// console.log($entity.AIComp.destination);
		AIComp.history = newData;
		$entity.AIComp.setState({ name: 'explore' });
	};
});