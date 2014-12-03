define([],
	function () {
	'use strict';

	return {
		run: function ($entity)
		{
			for (var i = 0, length = $entity.posComp.cell.getActors().length; i < length; i += 1)
			{
				var currActor = $entity.posComp.cell.getActors()[i];
				if (currActor === $entity) { continue; }
				currActor.vitalsComp.health.decrease($entity.abilitiesComp.strength);
			}
		}
	};
});