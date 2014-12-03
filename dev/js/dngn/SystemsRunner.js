define(['dngn/AISystem', 'dngn/MovingSystem', 'dngn/FightingSystem', 'dngn/VitalsSystem', 'dngn/DeletionSystem'],
	function (AISystem, MovingSystem, FightingSystem, VitalsSystem, DeletionSystem) {
	'use strict';

	return {
		run: function ($entity)
		{
			VitalsSystem.run($entity);
			AISystem.run($entity);
			FightingSystem.run($entity);
			MovingSystem.run($entity);
			DeletionSystem.run($entity);
		}
	};
});