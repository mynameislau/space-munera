define(['dngn/InfluenceMap', 'dngn/CoordinatedData'],
	function (InfluenceMap, CoordinatedData) {
	'use strict';

	var InfluencesManager = {

		init: function ($map)
		{
			this._actorInfluences = [];
			this._map = $map;
			var perf = performance.now();
			this.generateAllDistanceMaps();
			console.log(performance.now() - perf);
			return this;
		},
		generateAllDistanceMaps: function ()
		{
			var cellsArray = this._map.getCellsArray();
			this._distanceMaps = new CoordinatedData();
			for (var i = 0, length = cellsArray.length; i < length; i += 1)
			{
				var distanceMap = new CoordinatedData();
				for (var k = 0; k < length; k += 1)
				{
					var currCell = cellsArray[k];
					distanceMap.addNode({ x: currCell.x, y: currCell.y, value: Infinity }, currCell.x, currCell.y);
				}
				distanceMap.breadthFirstMapping(cellsArray[i].x, cellsArray[i].y);
				this._distanceMaps.addNode(cellsArray[i].x, cellsArray[i].y);
			}
		},
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
		//todo -> several influences on same cell
		getInfluencesForCell: function ($cell, $cellsArray)
		{
			var influencesArray;
			var terrain = $cell.getTerrain();
			if (terrain === 'W' || terrain === 'F' || terrain === 'H' || terrain === 'X')
			{
				influencesArray = [];
				var properties = {
					type: terrain === 'X' ? 'fleeing' : 'soft',
					modifiers: {}
				};
				properties.modifiers[terrain] = 4;
				var influence = new InfluenceMap($cellsArray, [$cell], properties);
				influencesArray.push(influence);
			}
			return influencesArray;
		},
		getMultiplier: function ($influenceMap, $x, $y, $entity)
		{
			var influenceNode = $influenceMap.getNodeFromCoords($x, $y);
			if (!influenceNode) { return 0; }

			var value = influenceNode.value;
			var bodyComp = $entity.bodyComp;
			var modifiers = $influenceMap.properties.modifiers;
			var multiplied = 0;
			multiplied += modifiers.exploration ? 2 * value : 0;
			multiplied += modifiers.W ? 1500 * (Math.pow(1 - bodyComp.water.value, 7)) * value : 0;
			multiplied += modifiers.F ? 1500 * (Math.pow(1 - bodyComp.food.value, 7)) * value : 0;
			multiplied += modifiers.H ? 3000 * (Math.pow(1 - bodyComp.health.value, 7)) * value : 0;
			multiplied += modifiers.X ? 100 * value : 0;
			
			if ($influenceMap.properties.entity)
			{
				var sameTeam = $influenceMap.properties.entity.ordersComp.team === $entity.ordersComp.team;
				var isNotUnit = $influenceMap.properties.entity.bodyComp.bodyType !== 'unit' ? true : false;
				var attack = sameTeam ? 0 : 2 * bodyComp.health.value * $entity.ordersComp.attacking;
				var defense = isNotUnit ? $entity.ordersComp.defending : 0;
				var multiplier = sameTeam ? defense : attack;

				multiplied += value * multiplier;
			}

			//multiplied /= $entity.mapComp.getCellFromCoords(influenceNode.x, influenceNode.y).getActors().length * 0.2 + 1;

			return multiplied;
		},
		getMovementMultiplier: function ($influenceMap, $x, $y, $entity)
		{
			var influenceNode = $influenceMap.getNodeFromCoords($x, $y);
			if (!influenceNode) { return 0; }

			var value = influenceNode.value;
			var bodyComp = $entity.bodyComp;
			var modifiers = $influenceMap.properties.modifiers;
			var multiplied = 0;
			multiplied += modifiers.X ? 10 * (1 - value) : 0;
			
			/*if ($influenceMap.properties.entity)
			{
				//todo
			}*/

			return multiplied;
		},
		getMovementScore: function ($x, $y, $influencesArray, $entity)
		{
			var score = 1;
			var k = 0;
			var influencesLength = $influencesArray.length;
			
			for (k; k < influencesLength; k += 1)
			{
				var currInf = $influencesArray[k];
				score += this.getMovementMultiplier(currInf, $x, $y, $entity);
			}
			return score;
		},
		getOverallInfluenceScore: function ($x, $y, $influencesArray, $entity)
		{
			var score = 0;
			var k = 0;
			var influencesLength = $influencesArray.length;
			
			for (k; k < influencesLength; k += 1)
			{
				var currInf = $influencesArray[k];
				score += this.getMultiplier(currInf, $x, $y, $entity);
			}
			return score;
		}
	};
	return InfluencesManager;
});