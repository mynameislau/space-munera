define(['dngn/InfluencesManager', 'dngn/Map', 'dngn/Display', 'dngn/Engine', 'dngn/Entity', 'dngn/SystemsRunner', 'dngn/MapParser', 'dngn/Debug', 'dngn/NameGenerator'],
	function (InfluencesManager, Map, Display, Engine, Entity, SystemsRunner, MapParser, Debug, NameGenerator) {
	'use strict';

	return {
		init: function ($mapString, $names)
		{
			Object.create(Debug).init();

			this.managers = {};

			this.managers.map = Object.create(Map).init();

			this._entities = [];

			this._engine = Object.create(Engine);
			this._engine.init();

			this.alertLevel = 0;

			this.managers.display = Object.create(Display);

			var parsedMapData = MapParser.parse($mapString);
			this.managers.map.generate(parsedMapData);
			this.managers.display.init(this.managers.map);
			this.managers.influencesManager = Object.create(InfluencesManager).init(this.managers.map);

			this._nameGenerator = Object.create(NameGenerator).init($names);

			this.createEntities(parsedMapData.entitiesArray);


			var render = function ()
			{
				this.managers.display.draw(this.managers.map, this._entities);
				window.requestAnimationFrame(render);
			}.bind(this);
			render();

			this.systemsRunner = Object.create(SystemsRunner).init(this._entities, this.managers);

			this._engine.start();
		},
		createEntities: function ($entityDataArray)
		{
			for (var i = 0, length = $entityDataArray.length; i < length; i += 1)
			{
				var currEntityData = $entityDataArray[i];
				this.createEntity(currEntityData);
			}
		},
		createEntity: function ($entityData)
		{
			if (this.alertLevel > 15 && $entityData.team === 'player') { return; }
			var entity = Entity.initEntity($entityData, this.managers.map);
			entity.prenom = this._nameGenerator.generate();
			this.managers.map.placeActor(entity, $entityData.position);
			this._entities.push(entity);
			entity.dispatcher.on('update', this.runSystems.bind(this));
			entity.dispatcher.on('deletion', this.removeEntity.bind(this));
			this._engine.add(entity);

			if ($entityData.team === 'player')
			{
				this.alertLevel += 1;
				if (this.alertLevel === 15)
				{
					this.createEntities([
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' },
						{ type: 'monster', team: 'enemy' }
					]);
				}
			}
			return entity;
		},
		removeEntity: function ($entity)
		{
			this._engine.remove($entity);
			this._entities.splice(this._entities.indexOf($entity), 1);
			this.managers.map.removeActorFromCell($entity);
		},
		runSystems: function ($entity)
		{
			this.systemsRunner.run($entity, $entity.type);
		}
	};
});