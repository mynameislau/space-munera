define([],
	function () {
	'use strict';

	return {
		getDist: function ($x1, $y1, $x2, $y2)
		{
			var xDist = Math.abs($x1 - $x2);
			var yDist = Math.abs($y1 - $y2);
			return Math.sqrt(xDist * xDist + yDist * yDist);
		}
	};
});