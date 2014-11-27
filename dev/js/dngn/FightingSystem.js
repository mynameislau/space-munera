define([],
	function () {
	'use strict';

	return function ($entity)
	{
		if ($entity.AIComp.getStateName() === 'fighting' && $entity.mapComp.getDist())
		{
			return undefined;
		}
	};
});