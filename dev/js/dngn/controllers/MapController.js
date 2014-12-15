define([],
	function () {
	'use strict';

	return {
		init: function ($mapView, $map, $entities)
		{
			$mapView.dispatcher.on('click', function ($position)
			{
				console.log($position);
				$entities.createEntity({ type: 'monster', team: 'player', position: { x: $position.x, y: $position.y } });
			});
		}
	};
});