define(['dngn/AISystem', 'dngn/MovingSystem', 'dngn/FightingSystem', 'dngn/VitalsSystem', 'dngn/DeletionSystem'],
	function (AISystem, MovingSystem, FightingSystem, VitalsSystem, DeletionSystem) {
	'use strict';

	return {
		run: function ($entity, $type)
		{
			switch ($type)
			{
				case 'actor':
					VitalsSystem.run($entity);
					AISystem.run($entity);
					FightingSystem.run($entity);
					MovingSystem.run($entity);
					DeletionSystem.run($entity);
					break;
				case 'static-active':
					VitalsSystem.run($entity);
					FightingSystem.run($entity);
					DeletionSystem.run($entity);
					break;
				case 'static-passive':
					VitalsSystem.run($entity);
					DeletionSystem.run($entity);
					break;
			}
		}
	};
});