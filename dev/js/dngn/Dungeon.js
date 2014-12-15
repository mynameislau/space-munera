define(['dngn/InfluencesManager', 'dngn/Map', 'dngn/Engine', 'dngn/MapParser', 'dngn/Debug', 'dngn/Entities'],
	function (InfluencesManager, Map, Engine, MapParser, Debug, Entities) {
	'use strict';

	return {
		init: function ($mapString, $names)
		{
			Object.create(Debug).init();

			this.managers = {};
			this.managers.map = Object.create(Map).init();
			this.managers.engine = Object.create(Engine).init();
			this.managers.entities = Object.create(Entities).init(this.managers, $names);

			var parsedMapData = MapParser.parse($mapString);
			this.managers.map.generate(parsedMapData);
			this.managers.influencesManager = Object.create(InfluencesManager).init(this.managers.map);

			this.managers.entities.createEntities(parsedMapData.entitiesArray);

			this.managers.engine.start();
		}
	};
});