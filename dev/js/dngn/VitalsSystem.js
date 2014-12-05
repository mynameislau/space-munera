define([],
	function () {
	'use strict';

	return {
		run: function ($entity)
		{
			var food = $entity.bodyComp.food;
			var water = $entity.bodyComp.water;
			var health = $entity.bodyComp.health;

			if (health.value <= 0) { return; }

			if ($entity.posComp.cell.getTerrain() === 'W')
			{
				water.increase(20);
			}
			/*else
			{
				water.decrease();
			}*/

			if ($entity.posComp.cell.getTerrain() === 'F')
			{
				food.increase(20);
			}
			/*else
			{
				food.decrease();
			}*/
			
			if ($entity.posComp.cell.getTerrain() === 'H')
			{
				health.increase(20);
			}

			/*if (food.value > 0.5 && water.value > 0.5)
			{
				health.increase(5);
			}*/
			if (food.value === 0 || water.value === 0)
			{
				health.decrease(5);
			}
		}
	};
});