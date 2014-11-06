define(['ROT'],
	function (ROT) {
	'use strict';

	return {

		compute: function ($map, $from, $to)
		{
			/* input callback informs about map structure */
			var passableCallback = function ($x, $y)
			{
				return ($map.getCellFromCoords($x, $y).isWalkable());
			};
			/* prepare path to given coords */
			var dijkstra = new ROT.Path.Dijkstra($to.getX(), $to.getY(), passableCallback);

			/* compute from given coords #1 */
			var path = [];
			dijkstra.compute($from.getX(), $from.getY(), function (x, y) {
				path.push($map.getCellFromCoords(x, y));
			});

			return path;
		}
	};
});