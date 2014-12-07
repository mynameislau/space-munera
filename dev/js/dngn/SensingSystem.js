define(['dngn/InfluenceMap', 'dngn/CoordinatedData', 'dngn/AbilityUtils', 'dngn/InfluenceUtils'],
	function (InfluenceMap, CoordinatedData, AbilityUtils, InfluenceUtils) {
	'use strict';

	return {
		run: function ($entity)
		{
			var AIComp = $entity.AIComp;
			var map = $entity.mapComp;
			var posComp = $entity.posComp;
			var selfCell = posComp.cell;
			var bodyComp = $entity.bodyComp;
			//recording visible data into memory 
			var actorsInfluences = [];
			var visibilityData = AbilityUtils.getVisibilityData(map.getCellData(), posComp.cell, $entity);
			
			var i = 0;
			var k = 0;
			var length = visibilityData.data.length;
			for (i; i < length; i += 1)
			{
				var currVisi = visibilityData.data[i];
				var visibleCell = currVisi.cell;
				var newItem = { cell: visibleCell, age: 0 };
				var walkableMapCells = AbilityUtils.getWalkableCells(map.getCellsArray(), $entity);
				var influenceData = InfluenceUtils.getInfluencesForCell(visibleCell, walkableMapCells);
				newItem.influenceData = influenceData;
				AIComp.addMemoryItem(newItem);

				//computing visible actors influences
				var cellActors = visibleCell.getActors();
				var cellActorsLength = cellActors.length;
				k = 0;
				for (k; k < cellActorsLength; k += 1)
				{
					var currActor = cellActors[k];
					if (currActor === $entity) { continue; }
					actorsInfluences.push(InfluenceUtils.getActorInfluence(currActor, AbilityUtils.getWalkableCells(visibilityData.cellsArray, $entity)));
					//window.debug.coordData = actorsInfluences[actorsInfluences.length - 1];
				}
			}

			//calculating exploration influence
			var isEdge = function ($cell)
			{
				if (AbilityUtils.canSeeThrough($cell, $entity))
				{
					var neighbours = map.getNeighbours($cell);
					for (var i = 0, length = neighbours.length; i < length; i += 1)
					{
						var currNeighbour = neighbours[i];
						if (AIComp.getMemoryItem(currNeighbour.key) === undefined) { return true; }
					}
				}
			};
			var edges = [];
			i = 0;
			var memory = AIComp.getMemoryArray();
			length = memory.length;
			var currMemory;
			
			var explorableCells = [];
			for (i; i < length; i += 1)
			{

				currMemory = memory[i];
				var currCell = currMemory.cell;
				if (AbilityUtils.isWalkable(currCell, $entity)) { explorableCells.push(currCell); }
				var cellIsEdge = isEdge(currCell);
				if (cellIsEdge) { edges.push(currCell); }
			}
		}
	};
});