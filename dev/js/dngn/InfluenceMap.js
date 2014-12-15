define(['dngn/CoordinatedData', 'dngn/MathUtils'],
	function (CoordinatedData, MathUtils) {
	'use strict';

	var InfluenceMap = function ($properties)
	{
		this.mapData = new CoordinatedData();

		/*switch ($properties.type)
		{
			case 'fleeing':
				this.mapData = this.generateFleeingMap($array, $goals);
				break;
			case 'plain':
				this.mapData = this.generatePlain($array, $goals);
				break;
			case 'zone':
				this.mapData = this.generateZone($array, $goals, $properties.radius);
				break;
		}*/

		this.properties = $properties;
	};
	InfluenceMap.generateFleeingMap = function ($goals, $array)
	{
		var coordData = new CoordinatedData();
		var length = $array.length;
		for (var i = 0; i < length; i += 1)
		{
			var currCell = $array[i];
			coordData.addNode({ x: currCell.x, y: currCell.y, value: Infinity }, currCell.x, currCell.y);
		}
		coordData.breadthFirstMapping($goals, 3);
		i = 0;
		length = coordData.array.length;
		for (i; i < length; i += 1)
		{
			var currNode = coordData.array[i];
			currNode.value = currNode.value === Infinity ? 1 : 0;
		}
		return coordData;
	};
	InfluenceMap.generateExponential = function ($array, $goals, $type)
	{
		var coordData = InfluenceMap.generateDijkstra($array, $goals);
		for (var i = 0, length = coordData.array.length; i < length; i += 1)
		{
			var currData = coordData.array[i];
			var distance = currData.value;
			if (!$type || $type === 'exponential') { currData.value = 1 / (distance + 1); }
			else if ($type === 'soft') { currData.value = 1 / (1 + distance * 0.4); }
		}
		return coordData;
	};
	InfluenceMap.generatePlain = function ($array, $goals)
	{
		return InfluenceMap.generateDijkstra($array, $goals);
	};
	InfluenceMap.generateZone = function ($array, $goals, $radius)
	{
		var coordData = InfluenceMap.generateDijkstra($array, $goals);
		for (var i = 0, length = coordData.array.length; i < length; i += 1)
		{
			var currData = coordData.array[i];
			currData.value = 1 / Math.pow(currData.value + 1, 5);
		}
		return coordData;
	};
	InfluenceMap.generateBreadthFirst = function ($goals, $array)
	{
		var coordData = new CoordinatedData();
		var length = $array.length;
		for (var k = 0; k < length; k += 1)
		{
			var currCell = $array[k];
			coordData.addNode({ x: currCell.x, y: currCell.y, value: Infinity }, currCell.x, currCell.y);
		}
		coordData.breadthFirstMapping($goals);
		return coordData;
	};
	InfluenceMap.generateDijkstra = function ($array, $goals)
	{
		var coordData = new CoordinatedData();

		for (var i = 0, length = $array.length; i < length; i += 1)
		{
			var currCell = $array[i];
			var dij = { cell: currCell, x: currCell.x, y: currCell.y, value: $goals.indexOf(currCell) !== -1 ? 0 : Infinity };
			coordData.addNode(dij, dij.x, dij.y);
		}
		i = 0;
		length = $goals.length;
		for (i; i < length; i += 1)
		{
			var currGoal = $goals[i];
			if (!coordData.getNodeAt(currGoal.x, currGoal.y)) { coordData.addNode({ cell: currGoal, x: currGoal.x, y: currGoal.y, value: 0 }, currGoal.x, currGoal.y); }
		}

		InfluenceMap.dijsktraScan(coordData);
		
		return coordData;
	};
	InfluenceMap.dijsktraScan = function ($dijkstraCoordData)
	{
		var dijArray = $dijkstraCoordData.array;
		var dijGraph = $dijkstraCoordData.graph;
		var dijArrayLength = dijArray.length;
		var changes;
		var i;
		do
		{
			changes = 0;
			i = 0;
			for (i; i < dijArrayLength; i += 1)
			{
				var currDij = dijArray[i];
				var neighbours = dijGraph.getNeighbours(currDij.x, currDij.y);

				for (var k = 0, neighLength = neighbours.length; k < neighLength; k += 1)
				{
					var currNeighbour = neighbours[k];
					if (currDij.value > currNeighbour.value + 1)
					{
						changes += 1;
						currDij.value = currNeighbour.value + 1;
					}
				}
			}
		}
		while (changes > 0);
	};

	return InfluenceMap;
});
