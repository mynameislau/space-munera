define(['dngn/Influences', 'dngn/InfluenceMap', 'dngn/CoordinatedData'],
	function (Influences, InfluenceMap, CoordinatedData) {
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
		var dijkstraMap = Influences.getDijkstraMap(historyCells, edges);
		var lowest;
		i = 0;
		var neigh = dijkstraMap.getNeighbours($entity.posComp.cell.x, $entity.posComp.cell.y).randomize();
		length = neigh.length;
		for (i; i < length; i += 1)
		{
			lowest = (!lowest || lowest.value > neigh[i].value) ? neigh[i] : lowest;
		}
		
		AIComp.degueu = dijkstraMap;
		$entity.AIComp.destination = lowest.cell;

		/// test desirs
		
		var results = new CoordinatedData();
		i = 0;
		var mapCells = map.getCellsArray();
		length = mapCells.length;
		var toEvaluate = [];
		for (i; i < length; i += 1)
		{
			var mapCell = mapCells[i];
			if (mapCell.isWalkable()) { toEvaluate.push(mapCell); }
		}
		var foodDijkstra = new InfluenceMap(toEvaluate, map.getCellsFromTerrain('F'), { type: 'exponential' });
		var waterDijkstra = new InfluenceMap(toEvaluate, map.getCellsFromTerrain('W'), { type: 'plain' });
		var trapDijkstra = new InfluenceMap(toEvaluate, map.getCellsFromTerrain('X'), { type: 'fleeing', radius: 2, decay: 0 });
		i = 0;
		length = foodDijkstra.array.length;
		console.log('length', foodDijkstra.array.length, trapDijkstra.array.length);
		for (i; i < length; i += 1)
		{
			var foodDij = foodDijkstra.array[i];
			var waterDij = waterDijkstra.array[i];
			var trapDij = trapDijkstra.array[i];
			var foodInf = 1 * foodDij.value;
			var waterInf = 1 * waterDij.value;
			var trapInf = -1 * trapDij.value;
			//console.log(trapDij.value);
			//console.log(foodDij.value, waterDij.value, foodDij.value * (waterDij.value * 2));
			results.addItem({ value: trapInf, cell: foodDij.cell }, foodDij.cell.x, foodDij.cell.y);
			/*if (foodDij.cell.x === 69 && foodDij.cell.y === 12) { console.log('haut',waterDij.value); }
			if (foodDij.cell.x === 69 && foodDij.cell.y === 14) { console.log('bas',waterDij.value); }*/
			//foodDij.value += waterDij.value;//, foodDij.value);
		}
		i = 0;
		//console.log(results);
		lowest = undefined;
		neigh = results.getNeighbours($entity.posComp.cell.x, $entity.posComp.cell.y).randomize();
		length = neigh.length;
		for (i; i < length; i += 1)
		{
			lowest = (!lowest || lowest.value < neigh[i].value) ? neigh[i] : lowest;
		}
		AIComp.degueu = results;
		//console.log(results.getItemFromCoords(69, 12).value);//, foodDijkstra.getItemFromCoords(69, 12).value, waterDijkstra.getItemFromCoords(69, 12).value);
		//console.log(results.getItemFromCoords(69, 14).value);//, foodDijkstra.getItemFromCoords(69, 14).value, waterDijkstra.getItemFromCoords(69, 14).value);
		//console.log('lowest', lowest.value);
		$entity.AIComp.destination = lowest.cell;
		/// fin testDesirs

		

		//$entity.AIComp.destination = map.getCell(highest.key);
		// console.log($entity.AIComp.destination);
		//AIComp.history = newData;
		$entity.AIComp.setState({ name: 'nothing' });
	};
});