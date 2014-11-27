define(['dngn/Pathfinder'],
	function (Pathfinder) {
	'use strict';

	return function ($entity)
	{
		var path = Pathfinder.compute($entity.mapComp, $entity.posComp.cell, $entity.AIComp.destination);
		//this.lastCell = actorCell;
		if (path.length > 0)
		{
			$entity.mapComp.addActorToCell(path[1], $entity);
			return true;
		}
		return false;
	};
});