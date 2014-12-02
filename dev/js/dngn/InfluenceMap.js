define(['dngn/CoordinatedData', 'dngn/MathUtils'],
	function (CoordinatedData, MathUtils) {
	'use strict';

	var InfluenceMap = function ($array, $goals, $options)
	{
		switch ($options.type)
		{
			case 'fleeing':
				this.generateFleeingMap($array, $goals);
				break;
			case 'plain':
				this.generatePlain($array, $goals);
				break;
			case 'zone':
				this.generateZone($array, $goals, $options.radius);
				break;
			default:
			case 'exponential':
				this.generateExponential($array, $goals);
				break;
		}

		this.array = this._coordinatedData.array;
		this.graph = this._coordinatedData.graph;
		this.obj = this._coordinatedData.obj;
		this.getItemFromCoords = this._coordinatedData.getItemFromCoords;
		this.getNeighbours = this._coordinatedData.getNeighbours;
		this.addItem = this._coordinatedData.addItem;
	};
	InfluenceMap.prototype.generateFleeingMap = function ($array, $goals)
	{
		var dijkstraFirst = this.generateDijkstra($array, $goals);
		for (var i = 0, length = dijkstraFirst.array.length; i < length; i += 1)
		{
			var curr = dijkstraFirst.array[i];
			curr.value *= - 1.2;
		}
		this.dijsktraScan(dijkstraFirst);
		this._coordinatedData = dijkstraFirst;
	};
	InfluenceMap.prototype.generateExponential = function ($array, $goals)
	{
		this._coordinatedData = this.generateDijkstra($array, $goals);
		for (var i = 0, length = this._coordinatedData.array.length; i < length; i += 1)
		{
			var currData = this._coordinatedData.array[i];
			currData.value = 1 / (currData.value + 1);
		}
	};
	InfluenceMap.prototype.generatePlain = function ($array, $goals)
	{
		this._coordinatedData = this.generateDijkstra($array, $goals);
	};
	InfluenceMap.prototype.generateZone = function ($array, $goals, $radius)
	{
		this._coordinatedData = this.generateDijkstra($array, $goals);
		for (var i = 0, length = this._coordinatedData.array.length; i < length; i += 1)
		{
			var currData = this._coordinatedData.array[i];
			currData.value = 1 / Math.pow(currData.value + 1, 5);
		}
	};
	InfluenceMap.prototype.generateDijkstra = function ($array, $goals)
	{
		var coordData = new CoordinatedData();

		for (var i = 0, length = $array.length; i < length; i += 1)
		{
			var currCell = $array[i];
			var dij = { cell: currCell, x: currCell.x, y: currCell.y, value: $goals.indexOf(currCell) !== -1 ? 0 : Infinity };
			coordData.addItem(dij, dij.x, dij.y);
		}

		this.dijsktraScan(coordData);
		
		return coordData;
	};

	InfluenceMap.prototype.dijsktraScan = function ($dijkstraCoordData)
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
