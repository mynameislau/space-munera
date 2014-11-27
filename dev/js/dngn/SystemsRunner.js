define(['dngn/AISystem', 'dngn/MovingSystem', 'dngn/FightingSystem'],
	function (aiSystem, movingSystem, fightingSystem) {
	'use strict';

	return {
		run: function ($entity)
		{
			aiSystem($entity);
			fightingSystem($entity);
			movingSystem($entity);
		}
	};
});