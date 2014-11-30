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
		
		AIComp.degueu = dijkstraMap;
		$entity.AIComp.destination = lowest.cell;

		/// test desirs
		
		var foodDijkstra = map.getDijkstraMap(map.getCellsArray(), map.getCellsFromTerrain('F'));
		var waterDijkstra = map.getDijkstraMap(map.getCellsArray(), map.getCellsFromTerrain('W'));
		i = 0;
		length = foodDijkstra.array.length;
		for (i; i < length; i += 1)
		{
			var foodDij = foodDijkstra.array[i];
			var waterDij = waterDijkstra.array[i];
			foodDij.value = Math.min(foodDij.value, waterDij.value);
		}
		i = 0;
		lowest = undefined;
		neigh = foodDijkstra.getNeighbours($entity.posComp.cell.x, $entity.posComp.cell.y);
		length = neigh.length;
		for (i; i < length; i += 1)
		{
			lowest = (!lowest || lowest.value > neigh[i].value) ? neigh[i] : lowest;
		}
		AIComp.degueu = foodDijkstra;
		$entity.AIComp.destination = lowest.cell;
		/// fin testDesirs

		

		//$entity.AIComp.destination = map.getCell(highest.key);
		// console.log($entity.AIComp.destination);
		//AIComp.history = newData;
		$entity.AIComp.setState({ name: 'nothing' });
	};
});