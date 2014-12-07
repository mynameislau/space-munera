define(['dngn/Map', 'dngn/Display', 'dngn/Engine', 'dngn/Entity', 'dngn/SystemsRunner', 'dngn/MapParser', 'dngn/Debug', 'dngn/NameGenerator'],
	function (Map, Display, Engine, Entity, SystemsRunner, MapParser, Debug, NameGenerator) {
	'use strict';

	return {
		init: function ($mapString, $names)
		{
			this._map = Object.create(Map);
			this._map.init();

			this._entities = [];

			this._engine = Object.create(Engine);
			this._engine.init();

			this.alertLevel = 0;

			this.display = Object.create(Display);
			var parsedMapData = MapParser.parse($mapString);
			this._map.generate(parsedMapData);
			this.display.init(this._map);

			this._nameGenerator = Object.create(NameGenerator).init($names);

			this.createEntities(parsedMapData.entitiesArray);

			Object.create(Debug).init();

			var render = function ()
			{
				this.display.draw(this._map, this._entities);
				window.requestAnimationFrame(render);
			}.bind(this);
			render();

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
			console.log('create');
			var entity = Entity.initEntity($entityData, this._map);
			entity.prenom = this._nameGenerator.generate();
			this._map.placeActor(entity, $entityData.position);
			this._entities.push(entity);
			entity.dispatcher.on('update', this.runSystems.bind(this));
			entity.dispatcher.on('deletion', this.removeEntity.bind(this));
			this._engine.add(entity);

			console.log(this.alertLevel);

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
			this._map.removeActorFromCell($entity);
		},
		runSystems: function ($entity)
		{
			SystemsRunner.run($entity, $entity.type);
		}
	};
});