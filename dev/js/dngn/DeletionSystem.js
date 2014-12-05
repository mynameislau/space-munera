define([],
	function () {
	'use strict';

	return {
		run: function ($entity)
		{
			if ($entity.bodyComp.health.value <= 0)
			{
				console.log($entity.prenom + ' deletion');
				$entity.dispatcher.fire('deletion', $entity);
			}
		}
	};
});