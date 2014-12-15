define(['dngn/InfluenceMap', 'dngn/CoordinatedData'],
	function (InfluenceMap, CoordinatedData) {
	'use strict';

	var InfluencesManager = {

		init: function ($map)
		{
			this._actorInfluences = {};
			this._explorationInfluences = {};
			this._cellInfluences = new CoordinatedData();
			this._map = $map;
			this._distanceMaps = new CoordinatedData();
			//this.generateAllDistanceMaps();
			return this;
		},
		generateAllDistanceMaps: function ()
		{
			var cellsArray = this._map.getCellsArray();
			for (var i = 0, length = cellsArray.length; i < length; i += 1)
			{
				var distanceMap = InfluenceMap.generateBreadthFirst([cellsArray[i]], cellsArray);
				var nodeData = { data: distanceMap, x: cellsArray[i].x, y: cellsArray[i].y };
				this._distanceMaps.addNode(nodeData, cellsArray[i].x, cellsArray[i].y);
			}
		},
		getDistanceMapAt: function ($x, $y)
		{
			var nodeData = this._distanceMaps.getNodeAt($x, $y);
			if (!nodeData)
			{
				var distanceMap = InfluenceMap.generateBreadthFirst([{ x: $x, y: $y }], this._map.getCellsArray());
				nodeData = { data: distanceMap, x: $x, y: $y };
				this._distanceMaps.addNode(nodeData, $x, $y);
			}
			return nodeData;
		},
		getActorInfluence: function ($entity)
		{
			var actorInfluence = this._actorInfluences[$entity.ID];
			if (!actorInfluence)
			{
				var properties = {
					entity: $entity,
					modifiers: {
						entity: 1
					}
				};
				this._actorInfluences[$entity.ID] = actorInfluence = new InfluenceMap(properties);
			}
			
			actorInfluence.mapData = this.getDistanceMapAt($entity.posComp.cell.x, $entity.posComp.cell.y).data;
			return actorInfluence;
		},
		getExplorationInfluence: function ($entityID, $cellsArray, $goals)
		{
			var exploration = this._explorationInfluences[$entityID];
			if (!exploration)
			{
				var properties = {
					modifiers: {
						exploration: 1
					}
				};
				exploration = new InfluenceMap(properties);
				exploration.mapData = InfluenceMap.generateBreadthFirst($goals, this._map.getCellsArray());
			}
			else
			{
				exploration.mapData.breadthFirstMapping($goals);
			}
			//window.debug.setCoordData(exploration.mapData, 'values');
			return exploration;
		},
		//todo -> several influences on same cell
		getInfluencesForCell: function ($cell, $cellsArray)
		{
			var cellInfluences = this._cellInfluences.getNodeAt($cell.x, $cell.y);
			if (!cellInfluences)
			{
				var influencesArray;
				var terrain = $cell.getTerrain();
				if (terrain === 'W' || terrain === 'F' || terrain === 'H' || terrain === 'X')
				{
					influencesArray = [];
					var properties = {
						modifiers: {}
					};
					properties.modifiers[terrain] = 4;
					var influence = new InfluenceMap(properties);
					if (terrain === 'X')
					{
						influence.mapData = InfluenceMap.generateFleeingMap([$cell], this._map.getCellsArray());
					}
					else
					{
						influence.mapData = this.getDistanceMapAt($cell.x, $cell.y).data;
					}
					influencesArray.push(influence);
				}
				cellInfluences = { data: influencesArray, x: $cell.x, y: $cell.y };
				this._cellInfluences.addNode(cellInfluences, $cell.x, $cell.y);
			}
			return cellInfluences.data;
		},
		getMultiplier: function ($influenceMap, $x, $y, $entity)
		{
			var influenceNode = $influenceMap.mapData.getNodeAt($x, $y);
			if (!influenceNode) { return 0; }

			var value = influenceNode.value;
			var bodyComp = $entity.bodyComp;
			var modifiers = $influenceMap.properties.modifiers;
			var multiplied = 0;
			multiplied += modifiers.exploration ? 2 / (value * 0.2 + 1) : 0;

			//debugger;
			/*multiplied += modifiers.W ? 1500 * (Math.pow(1 - bodyComp.water.value, 7)) * value : 0;
			multiplied += modifiers.F ? 1500 * (Math.pow(1 - bodyComp.food.value, 7)) * value : 0;
			multiplied += modifiers.H ? 3000 * (Math.pow(1 - bodyComp.health.value, 7)) * value : 0;*/
			multiplied += modifiers.X ? 10 * value : 0;
			
			/*if ($influenceMap.properties.entity)
			{
				var sameTeam = $influenceMap.properties.entity.ordersComp.team === $entity.ordersComp.team;
				var isNotUnit = $influenceMap.properties.entity.bodyComp.bodyType !== 'unit' ? true : false;
				var attack = sameTeam ? 0 : 2 * bodyComp.health.value * $entity.ordersComp.attacking;
				var defense = isNotUnit ? $entity.ordersComp.defending : 0;
				var multiplier = sameTeam ? defense : attack;

				multiplied += value * multiplier;
			}*/

			//multiplied /= $entity.mapComp.getCellFromCoords(influenceNode.x, influenceNode.y).getActors().length * 0.2 + 1;

			return multiplied;
		},
		getMovementMultiplier: function ($influenceMap, $x, $y, $entity)
		{
			var influenceNode = $influenceMap.mapData.getNodeAt($x, $y);
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