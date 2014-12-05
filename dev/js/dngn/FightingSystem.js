define([],
	function () {
	'use strict';

	return {
		run: function ($entity)
		{
			var neighbours = $entity.AIComp.getMemoryNeighbours($entity.posComp.cell.x, $entity.posComp.cell.y);
			var attackable = $entity.posComp.cell.getActors().concat();

			for (var i = 0, length = neighbours.length; i < length; i += 1)
			{
				var currNeighMemo = neighbours[i];
				var neighActors = currNeighMemo.cell.getActors();
				if (neighActors.length > 0)
				{
					attackable = attackable.concat(neighActors);
				}
			}
			
			i = 0;
			length = attackable.length;
			for (i; i < length; i += 1)
			{
				var currAttackable = attackable[i];
				if (currAttackable === $entity || currAttackable.ordersComp.team === $entity.ordersComp.team) { continue; }
				currAttackable.bodyComp.health.decrease($entity.bodyComp.strength);
			}
		}
	};
});