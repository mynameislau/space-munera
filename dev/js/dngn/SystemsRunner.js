define(['dngn/AISystem', 'dngn/MovingSystem', 'dngn/FightingSystem', 'dngn/VitalsSystem', 'dngn/DeletionSystem'],
	function (AISystem, MovingSystem, FightingSystem, VitalsSystem, DeletionSystem) {
	'use strict';

	return {
		init: function ($entities, $managers)
		{
			this._entities = $entities;
			this._managers = $managers;
			return this;
		},
		run: function ($entity, $type)
		{
			switch ($type)
			{
				case 'actor':
					VitalsSystem.run($entity, this._managers);
					AISystem.run($entity, this._managers);
					FightingSystem.run($entity, this._managers);
					MovingSystem.run($entity, this._managers);
					DeletionSystem.run($entity, this._managers);
					break;
				case 'static-active':
					VitalsSystem.run($entity, this._managers);
					FightingSystem.run($entity, this._managers);
					DeletionSystem.run($entity, this._managers);
					break;
				case 'static-passive':
					VitalsSystem.run($entity, this._managers);
					DeletionSystem.run($entity, this._managers);
					break;
			}
		}
	};
});