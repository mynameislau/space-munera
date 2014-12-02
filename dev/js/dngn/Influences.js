define(['dngn/CoordinatedData'],
	function (CoordinatedData) {
	'use strict';

	return {

		getDijkstraMap: function ($array, $goals)
		{
			var coordData = new CoordinatedData();
			var dijArray = coordData.array;
			var dijGraph = coordData.graph;

			for (var i = 0, length = $array.length; i < length; i += 1)
			{
				var currCell = $array[i];
				var dij = { cell: currCell, x: currCell.x, y: currCell.y, value: $goals.indexOf(currCell) !== -1 ? 0 : Infinity };
				coordData.addItem(dij, dij.x, dij.y);
			}
			var dijArrayLength = dijArray.length;
			var changes;
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
			return coordData;
		}
	};
});