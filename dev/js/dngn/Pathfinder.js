define(['ROT'],
	function (ROT) {
	'use strict';

	return {

		compute: function ($map, $from, $to)
		{
			/* input callback informs about map structure */
			var passableCallback = function ($x, $y)
			{
				if ($x === $from.getX() && $y === $from.getY()) { return true; }
				if ($x < 0 || $x > $map.width - 1 || $y < 0 || $y > $map.height - 1) { return; }
				return ($map.getCellFromCoords($x, $y).isWalkable());
			};
			/* prepare path to given coords */
			var dijkstra = new ROT.Path.Dijkstra($to.getX(), $to.getY(), passableCallback, { topology: 4 });

			/* compute from given coords #1 */
			var path = [];
			dijkstra.compute($from.getX(), $from.getY(), function (x, y) {
				path.push($map.getCellFromCoords(x, y));
			});

			return path;
		}
	};
});