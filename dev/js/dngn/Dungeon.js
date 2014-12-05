define(['dngn/Map', 'dngn/Display', 'dngn/Engine', 'dngn/Entity', 'dngn/SystemsRunner', 'dngn/MapParser', 'dngn/Debug', 'dngn/NameGenerator'],
	function (Map, Display, Engine, Entity, SystemsRunner, MapParser, Debug, NameGenerator) {
	'use strict';

	return {
		init: function ($mapString, $names)
		{
			this._map = Object.create(Map);
			this._map.init();

			this._actors = [];

			this._engine = Object.create(Engine);
			this._engine.init();

			this._display = Object.create(Display);
			this._display.init(this._map);
			var parsedMapData = MapParser.parse($mapString);
			this._map.generate(parsedMapData);

			this._nameGenerator = Object.create(NameGenerator).init($names);

			this.createActors(parsedMapData.actorsArray);

			Object.create(Debug).init();


			this._engine.start();
		},
		createActors: function ($actorDataArray)
		{
			if ($actorDataArray.length === 0)
			{
				this.createActor().prenom = 'toto';
				//this.createActor().prenom = 'victor';
			}
			else
			{
				for (var i = 0, length = $actorDataArray.length; i < length; i += 1)
				{
					var currActorData = $actorDataArray[i];
					this.createActor(currActorData);
				}
			}
		},
		createActor: function ($actorData)
		{
			var actor = Entity.initEntity($actorData, this._map);
			actor.prenom = this._nameGenerator.generate();
			this._map.placeActor(actor, $actorData.position);
			this._actors.push(actor);
			actor.dispatcher.on('update', this.runSystems.bind(this));
			actor.dispatcher.on('deletion', this.removeActor.bind(this));
			this._engine.add(actor);
			return actor;
		},
		removeActor: function ($actor)
		{
			this._engine.remove($actor);
			this._actors.splice(this._actors.indexOf($actor), 1);
			this._map.removeActorFromCell($actor);
		},
		runSystems: function ($entity)
		{
			SystemsRunner.run($entity, $entity.type);
			this._display.draw(this._map, this._actors);
		}
	};
});