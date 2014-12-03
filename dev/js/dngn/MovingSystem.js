define(['dngn/Pathfinder'],
	function (Pathfinder) {
	'use strict';

	return {
		run: function ($entity)
		{
			if (!$entity.AIComp.destination) { return; }
			//var path = Pathfinder.compute($entity.mapComp, $entity.posComp.cell, $entity.AIComp.destination);
			//this.lastCell = actorCell;
			$entity.mapComp.addActorToCell($entity.AIComp.destination, $entity);
			/*if (path.length > 1)
			{
				$entity.mapComp.addActorToCell(path[1], $entity);
				return true;
			}
			else
			{
				throw new Error('veut bouger sur lui meme');
			}*/
		}
	};
});