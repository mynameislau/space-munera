define(['dngn/NameGenerator', 'dngn/Entity', 'dngn/SystemsRunner'],
	function (NameGenerator, Entity, SystemsRunner) {
	'use strict';

	return {
		init: function ($managers, $names) {
			
			this._array = [];
			this.managers = $managers;
			this._nameGenerator = Object.create(NameGenerator).init($names);
			this._systemsRunner = Object.create(SystemsRunner).init(this._array, this.managers);
			this._engine = $managers.engine;
			this._engine.dispatcher.on('loop', this.update.bind(this));
			this._delta = window.performance.now();
			this._freq = 100;
			this._count = 0;
			return this;
		},
		getArray: function ()
		{
			return this._array;
		},
		update: function ($now)
		{
			var time = $now - this._delta;
			if (time > this._freq / this._array.length)
			{
				this._delta = $now;
				this._systemsRunner.run(this._array[this._count], this._array[this._count].type);
				this._count = this._count < this._array.length - 1 ? this._count + 1 : 0;
			}
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
			entity.ID = this._array.length;
			entity.prenom = this._nameGenerator.generate();
			this.managers.map.placeActor(entity, $entityData.position);
			this._array.push(entity);
			//entity.dispatcher.on('update', this.runSystems.bind(this));
			entity.dispatcher.on('deletion', this.removeEntity.bind(this));

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
			this._array.splice(this._array.indexOf($entity), 1);
			this.managers.map.removeActorFromCell($entity);
		}
	};
});