define([],
	function () {
	'use strict';

	var Graph = function ()
	{
	};

	Graph.prototype = [];
	Graph.prototype.getNode = function ($x, $y)
	{
		if (this[$y] && this[$y][$x]) { return this[$y][$x]; }
	};

	//works only if no diagonal
	Graph.prototype.getNeighboursInRadius = function ($x, $y, $radius)
	{
		var yStart = $y - $radius;
		var yLimit = $y + $radius;
		var toReturn = [];
		for (var i = yStart; i <= yLimit; i += 1)
		{
			var yTab = this[i];
			if (!yTab) { continue; }
			var calc = ($radius - Math.abs($y - i));
			console.log(calc);
			var k = $y - calc;
			var length = $y + calc + 1;
			for (k; k < length; k += 1)
			{
				var value = yTab[k];
				if (!value || (i === $y && k === $x)) { continue; }
				toReturn.push(value);
			}
		}
		return toReturn;
	};
	Graph.prototype.getNeighbours = function ($x, $y)
	{
		var toReturn = [];
		//if (this[$y - 1] && this[$y - 1][$x - 1]) { toReturn.push(this[$y - 1][$x - 1]); }
		if (this[$y + 0] && this[$y + 0][$x - 1]) { toReturn.push(this[$y + 0][$x - 1]); }
		//if (this[$y + 1] && this[$y + 1][$x - 1]) { toReturn.push(this[$y + 1][$x - 1]); }
		if (this[$y + 1] && this[$y + 1][$x + 0]) { toReturn.push(this[$y + 1][$x + 0]); }
		//if (this[$y + 1] && this[$y + 1][$x + 1]) { toReturn.push(this[$y + 1][$x + 1]); }
		if (this[$y + 0] && this[$y + 0][$x + 1]) { toReturn.push(this[$y + 0][$x + 1]); }
		//if (this[$y - 1] && this[$y - 1][$x + 1]) { toReturn.push(this[$y - 1][$x + 1]); }
		if (this[$y - 1] && this[$y - 1][$x + 0]) { toReturn.push(this[$y - 1][$x + 0]); }
		return toReturn;
	};

	return Graph;
});