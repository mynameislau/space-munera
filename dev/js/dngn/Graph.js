define([],
	function () {
	'use strict';

	var Graph = function ()
	{
	};

	Graph.prototype = [];
	Graph.prototype.getItem = function ($x, $y)
	{
		if (this[$x] && this[$x][$y]) { return this[$x][$y]; }
	};
	Graph.prototype.getNeighbours = function ($x, $y)
	{
		var toReturn = [];
		//if (this[$x - 1] && this[$x - 1][$y - 1]) { toReturn.push(this[$x - 1][$y - 1]); }
		if (this[$x + 0] && this[$x + 0][$y - 1]) { toReturn.push(this[$x + 0][$y - 1]); }
		//if (this[$x + 1] && this[$x + 1][$y - 1]) { toReturn.push(this[$x + 1][$y - 1]); }
		if (this[$x + 1] && this[$x + 1][$y + 0]) { toReturn.push(this[$x + 1][$y + 0]); }
		//if (this[$x + 1] && this[$x + 1][$y + 1]) { toReturn.push(this[$x + 1][$y + 1]); }
		if (this[$x + 0] && this[$x + 0][$y + 1]) { toReturn.push(this[$x + 0][$y + 1]); }
		//if (this[$x - 1] && this[$x - 1][$y + 1]) { toReturn.push(this[$x - 1][$y + 1]); }
		if (this[$x - 1] && this[$x - 1][$y + 0]) { toReturn.push(this[$x - 1][$y + 0]); }
		return toReturn;
	};

	return Graph;
});