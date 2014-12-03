define(['dngn/Influences', 'dngn/InfluenceMap', 'dngn/CoordinatedData', 'dngn/AbilityUtils'],
	function (Influences, InfluenceMap, CoordinatedData, AbilityUtils) {
	'use strict';

	return {
		run: function ($entity)
		{
			var AIComp = $entity.AIComp;
			var map = $entity.mapComp;
			var posComp = $entity.posComp;
			var selfCell = posComp.cell;
			var abilities = $entity.abilitiesComp;
			var vitalsComp = $entity.vitalsComp;
			//recording visible data into memory 
			var actorsInfluences = [];
			var visibilityData = AbilityUtils.getVisibilityData(map.getCellData(), posComp.cell, abilities);
			var i = 0;
			var k = 0;
			var length = visibilityData.data.length;
			//console.log($entity.prenom + '----------------------------');
			for (i; i < length; i += 1)
			{
				var currVisi = visibilityData.data[i];
				var visibleCell = currVisi.cell;
				var newItem = { cell: visibleCell, age: 0 };
				var walkableMapCells = AbilityUtils.getWalkableCells(map.getCellsArray(), abilities);
				var influenceData = InfluenceMap.getInfluencesForCell(visibleCell, walkableMapCells);
				newItem.influenceData = influenceData;
				AIComp.addMemoryItem(newItem);

				var cellActors = visibleCell.getActors();
				var cellActorsLength = cellActors.length;
				k = 0;
				for (k; k < cellActorsLength; k += 1)
				{
					var currActor = cellActors[k];
					if (currActor === $entity) { continue; }
					actorsInfluences.push(InfluenceMap.getActorInfluence(currActor.posComp.cell, AbilityUtils.getWalkableCells(visibilityData.cellsArray, abilities)));
					//window.debug.coordData = actorsInfluences[actorsInfluences.length - 1];
				}
			}

			//calculating exploration influence
			var isEdge = function ($cell)
			{
				if (AbilityUtils.canSeeThrough($cell, abilities))
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
				if (AbilityUtils.isWalkable(currCell)) { explorableCells.push(currCell); }
				var cellIsEdge = isEdge(currCell);
				if (cellIsEdge) { edges.push(currCell); }
				//console.log('isEdge', cellIsEdge);
			}
			var explorationInfluence = InfluenceMap.getExplorationInfluence(explorableCells, edges);

			//retrieving influences
			var influencesArray = [explorationInfluence];
			influencesArray = influencesArray.concat(actorsInfluences);
			i = 0;
			k = 0;
			length = memory.length;
			for (i; i < length; i += 1)
			{
				var currInfluenceData = memory[i].influenceData;
				influencesArray = currInfluenceData.length > 0 ? influencesArray.concat(currInfluenceData) : influencesArray;
			}




			var highScore = 0;
			i = 0;
			var close = AIComp.getMemoryNeighbours(posComp.cell.x, posComp.cell.y).randomize();
			close.push({ cell: posComp.cell });

			length = close.length;
			var multiply = function ($value, $modifiers)
			{
				var multiplied = 0;
				multiplied += $modifiers.exploration ? 2 * $value : 0;
				multiplied += $modifiers.W ? 1500 * (Math.pow(1 - vitalsComp.water.value, 7)) * $value : 0;
				multiplied += $modifiers.F ? 1500 * (Math.pow(1 - vitalsComp.food.value, 7)) * $value : 0;
				multiplied += $modifiers.H ? 3000 * (Math.pow(1 - vitalsComp.health.value, 7)) * $value : 0;
				multiplied += $modifiers.attack ? 2 * $value * vitalsComp.health.value : 0;
				return multiplied;
			};
			for (i; i < length; i += 1)
			{
				var currNeigh = close[i];
				var currScore = 0;
				k = 0;
				var influencesLength = influencesArray.length;
				
				for (k; k < influencesLength; k += 1)
				{
					var currInf = influencesArray[k];
					//if (currInf.modifiers.W) { window.debug.coordData = currInf; }
					var currInfNode = currInf.getNodeFromCoords(currNeigh.cell.x, currNeigh.cell.y);
					if (!currInfNode) { break; }
					currScore += multiply(currInfNode.value, currInf.modifiers);
				}

				if (!highScore || currScore > highScore)
				{
					highScore = currScore;
					$entity.AIComp.destination = currNeigh.cell;
				}
			}
			//console.log(highScore);
			
			window.debug.sumInfluences(influencesArray, multiply);
			//window.debug.memory = AIComp.getMemory();


			// aging memories
			i = 0;
			length = memory.length;
			for (i; i < length; i += 1)
			{
				currMemory = memory[i];
				currMemory.age += 1;
			}

			//$entity.AIComp.destination = map.getCell(highest.key);
			// console.log($entity.AIComp.destination);
			//AIComp.memory = newData;
			$entity.AIComp.setState({ name: 'nothing' });
		}
	};
});