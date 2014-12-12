define(['libs/Astar'],
	function (Astar) {
	'use strict';

	return {
		run: function ($entity, $managers)
		{
			var AIComp = $entity.AIComp;
			var currentPos = $entity.posComp.cell;
			var posComp = $entity.posComp;

			
			/*console.log('from', currentPos.x, currentPos.y);
			console.log('goto', AIComp.destination.x, AIComp.destination.y);*/
			//window.debug.path = posComp.path;
			if (posComp.nextStep === posComp.cell) { return; }
			$managers.map.addActorToCell(posComp.nextStep, $entity);
			//var path = Pathfinder.compute($entity.mapComp, $entity.posComp.cell, $entity.AIComp.destination);
			//this.lastCell = actorCell;
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