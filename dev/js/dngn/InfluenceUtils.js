define(['dngn/InfluenceMap'],
	function (InfluenceMap) {
	'use strict';

	return {
		getActorInfluence: function ($entity, $cellsArray)
		{
			var properties = {
				type: 'exponential',
				entity: $entity,
				modifiers: {
					entity: 1
				}
			};
			return new InfluenceMap($cellsArray, [$entity.posComp.cell], properties);
		},
		getExplorationInfluence: function ($cellsArray, $goals)
		{
			var properties = {
				type: 'soft',
				modifiers: {
					exploration: 1
				}
			};
			return new InfluenceMap($cellsArray, $goals, properties);
		},
		getInfluencesForCell: function ($cell, $cellsArray)
		{
			var influencesArray = [];
			if ($cell.getTerrain() === 'W' || $cell.getTerrain() === 'F' || $cell.getTerrain() === 'H')
			{
				var properties = {
					type: 'soft',
					modifiers: {}
				};
				properties.modifiers[$cell.getTerrain()] = 4;
				var influence = new InfluenceMap($cellsArray, [$cell], properties);
				influencesArray.push(influence);
			}
			return influencesArray;
		},
		getMultiplier: function ($node, $influenceMap, $entity)
		{
			var value = $node.value;
			var bodyComp = $entity.bodyComp;
			var modifiers = $influenceMap.properties.modifiers;
			var multiplied = 0;
			multiplied += modifiers.exploration ? 2 * value : 0;
			multiplied += modifiers.W ? 1500 * (Math.pow(1 - bodyComp.water.value, 7)) * value : 0;
			multiplied += modifiers.F ? 1500 * (Math.pow(1 - bodyComp.food.value, 7)) * value : 0;
			multiplied += modifiers.H ? 3000 * (Math.pow(1 - bodyComp.health.value, 7)) * value : 0;
			
			if ($influenceMap.properties.entity)
			{
				var sameTeam = $influenceMap.properties.entity.ordersComp.team === $entity.ordersComp.team;
				var isNotUnit = $influenceMap.properties.entity.type !== 'actor' ? 1 : 0;
				var attack = sameTeam ? 0 : 2 * bodyComp.health.value * $entity.ordersComp.attacking;
				var defense = sameTeam && isNotUnit ? $entity.ordersComp.defending : 0;
				var multiplier = sameTeam ? defense : attack;

				multiplied += value * multiplier;
			}

			multiplied /= $entity.mapComp.getCellFromCoords($node.x, $node.y).getActors().length * 0.2 + 1;

			return multiplied;
		}
	};
});