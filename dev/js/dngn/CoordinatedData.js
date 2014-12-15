define(['dngn/Graph'],
	function (Graph) {
	'use strict';

	var CoordinatedData = function ()
	{
		this.array = [];
		this.graph = new Graph();
	};
	CoordinatedData.prototype.getNodeAt = function ($x, $y)
	{
		return this.graph.getNode($x, $y);
	};
	CoordinatedData.prototype.getNeighboursInRadius = function ($x, $y, $radius)
	{
		return this.graph.getNeighboursInRadius($x, $y, $radius);
	};
	CoordinatedData.prototype.getNeighbours = function ($x, $y)
	{
		return this.graph.getNeighbours($x, $y);
	};
	CoordinatedData.prototype.addNode = function ($item, $x, $y)
	{
		this.array.push($item);
		this.graph[$y] = this.graph[$y] || [];
		this.graph[$y][$x] = $item;
	};
	//rajoute plein de proprietés sur des objets qui ont rien demandé....
	CoordinatedData.prototype.breadthFirstMapping = function ($goals, $maxDist)
	{
		var openList = [];
		var maxDist = $maxDist || Infinity;
		var neighbours;
		var neighbour;
		var node;
		var i;
		var l;

		// push the start positions into the queue
		for (var k = 0, length = $goals.length; k < length; k += 1)
		{
			var currGoal = $goals[k];
			var startNode = this.getNodeAt(currGoal.x, currGoal.y);
			openList.push(startNode);
			startNode.opened = true;
			startNode.value = 0;
		}

		// while the queue is not empty
		while (openList.length) {
			// take the front node from the queue
			node = openList.shift();
			node.closed = true;

			if (node.value >= maxDist)
			{
				break;
			}

			neighbours = this.getNeighbours(node.x, node.y);

			for (i = 0, l = neighbours.length; i < l; i += 1) {
				neighbour = neighbours[i];

				// skip this neighbour if it has been inspected before
				if (neighbour.closed || neighbour.opened) {
					continue;
				}

				openList.push(neighbour);
				neighbour.opened = true;
				neighbour.parent = node;
				
				neighbour.value = node.value + 1;
			}
		}
	};

	return CoordinatedData;
});