define(['dngn/Graph'],
	function (Graph) {
	'use strict';

	var CoordinatedData = function ()
	{
		this.array = [];
		this.obj = {};
		this.graph = new Graph();
	};
	CoordinatedData.prototype.getNodeFromKey = function ($key)
	{
		return this.obj[$key];
	};
	CoordinatedData.prototype.getNodeFromCoords = function ($x, $y)
	{
		return this.graph.getNode($x, $y);
	};
	CoordinatedData.prototype.getNeighbours = function ($x, $y)
	{
		return this.graph.getNeighbours($x, $y);
	};
	CoordinatedData.prototype.addNode = function ($item, $x, $y)
	{
		this.obj[$x + ',' + $y] = $item;
		this.array.push($item);
		this.graph[$y] = this.graph[$y] || [];
		this.graph[$y][$x] = $item;
	};

	return CoordinatedData;
});