define(['jquery',
		'dngn/views/MapDisplay',
		'dngn/controllers/MapController'
		],
	function (jquery, MapDisplay, MapController) {
	'use strict';

	return {
		init: function ($managers)
		{
			this.mapDisplay = Object.create(MapDisplay);
			this.mapDisplay.init($managers.map, $managers.engine, $managers.entities);
			this.mapController = Object.create(MapController).init(this.mapDisplay, $managers.map, $managers.entities);
			//this.mapDisplay.on('')
			return this;
		}
	};
});