define([],
	function () {
	'use strict';

	return function ($entity)
	{
		var AIComp = $entity.AIComp;
		var map = $entity.mapComp;
		var oldData = AIComp.getHistory().concat();
		var oldDestination = AIComp.destination;
		var selfCell = $entity.posComp.cell;
		var newCellScores = [];
		var visibilityData = map.getVisibilityData($entity.posComp.cell);
		
		for (var i = 0, length = visibilityData.length; i < length; i += 1)
		{
			var currVisi = visibilityData[i];
			var key = currVisi.cell.key;
			AIComp.addHistoryItem({ key: key, age: 0 });
			//if (!AIComp.getHistoryItem(key)) { AIComp.addItem({key: key}); }
		}
		var isEdge = function ($cell)
		{
			//console.log('lightPasses', $cell.lightPasses());
			if ($cell.lightPasses())
			{
				var neighbours = map.getNeighbours($cell);
				//console.log('neighbours', neighbours);
				for (var i = 0, length = neighbours.length; i < length; i += 1)
				{
					var currNeighbour = neighbours[i];
					//console.log('exist', AIComp.getHistoryItem(currNeighbour.key), AIComp.getHistoryItem(currNeighbour.key) === undefined);
					if (AIComp.getHistoryItem(currNeighbour.key) === undefined) { return true; }
				}
			}
		};
		var edges = [];
		i = 0;
		var history = AIComp.getHistory();
		length = history.length;
		var historyCells = [];
		for (i; i < length; i += 1)
		{

			var currItem = history[i];
			var currCell = map.getCell(currItem.key);
			historyCells.push(currCell);
			var cellIsEdge = isEdge(currCell);
			if (cellIsEdge) { edges.push(currCell); }
			//console.log('isEdge', cellIsEdge);
		}
		var dijkstraMap = map.getDijkstraMap(historyCells, edges);
		var lowest;
		i = 0;
		var neigh = dijkstraMap.getNeighbours($entity.posComp.cell.x, $entity.posComp.cell.y);
		length = neigh.length;
		for (i; i < length; i += 1)
		{
			lowest = (!lowest || lowest.value > neigh[i].value) ? neigh[i] : lowest;
		}
		$entity.AIComp.destination = lowest.cell;

		AIComp.degueu = dijkstraMap;
		AIComp.edges = edges;
		
		////////////////////////

		

		//$entity.AIComp.destination = map.getCell(highest.key);
		// console.log($entity.AIComp.destination);
		//AIComp.history = newData;
		$entity.AIComp.setState({ name: 'nothing' });
	};
});