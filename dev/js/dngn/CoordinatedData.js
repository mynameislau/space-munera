define(['dngn/Graph'],
	function (Graph) {
	'use strict';

	var CoordinatedData = function ()
	{
		this.array = [];
		this.obj = {};
		this.graph = new Graph();
	};
	CoordinatedData.prototype.getItemFromCoords = function ($x, $y)
	{
		return this.graph.getItem($x, $y);
	};
	CoordinatedData.prototype.getNeighbours = function ($x, $y)
	{
		return this.graph.getNeighbours($x, $y);
	};
	CoordinatedData.prototype.addItem = function ($item, $x, $y)
	{
		this.obj[$x + ',' + $y] = $item;
		this.array.push($item);
		this.graph[$x] = this.graph[$x] || [];
		this.graph[$x][$y] = $item;
	};

	return CoordinatedData;
});