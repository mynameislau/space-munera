define(['dngn/InfluenceMap', 'dngn/CoordinatedData', 'dngn/AbilityUtils', 'dngn/influencesManager', 'libs/Astar'],
	function (InfluenceMap, CoordinatedData, AbilityUtils, influencesManager, Astar) {
	'use strict';
	/*******************************
	ATTENTION : certaines choses sont 'en dur', comme par exemple, le fait qu'un agent puisse marcher
	ou pas sur une cellule, ses influences sont stockées et normalement pas regénérée,
	ceci à des fins d'optimisation. Si cette capacité est amenée à être modifiée
	au runtime, il faudra modifier le code. 
	TODO : optimiser de maniere a ce que l'influence d'une entité ou d'une cellule soit commune à tous
	les agents possédant les meme capacité (peut marcher ou pas sur tel cellule, etc.)
	*******************************/
	return {

		run: function ($entity, $managers)
		{
			var AIComp = $entity.AIComp;
			var map = $managers.map;
			var posComp = $entity.posComp;
			var selfCell = posComp.cell;
			var bodyComp = $entity.bodyComp;
			var influencesManager = $managers.influencesManager;
			
			//recording visible data into memory 
			var actorsInfluences = [];
			var visibilityData = AbilityUtils.getVisibilityData(map.getCellData(), posComp.cell, $entity);
			var walkableMapCells = AbilityUtils.getWalkableCells(map.getCellsArray(), $entity);
			var i = 0;
			var k = 0;
			var length = visibilityData.data.length;
			var visibleActors = [];
			
			for (i; i < length; i += 1)
			{
				var currVisi = visibilityData.data[i];
				var visibleCell = currVisi.cell;
				var isNew = AIComp.addMemoryItem(visibleCell, AbilityUtils.isWalkable(visibleCell, $entity));
				if (isNew)
				{
					var influenceData = influencesManager.getInfluencesForCell(visibleCell, walkableMapCells);
					AIComp.addCellInfluence(influenceData);
				}
				visibleActors = visibleActors.concat(visibleCell.getActors());
			}

			var memory = AIComp.getMemoryArray();
			var walkableCellsMemory = AIComp.walkableCellsMemory;

			//computing visible actors influences



			/********* TO OPTIMIZE !!!!!! *********/

			i = 0;
			length = visibleActors.length;
			for (i; i < length; i += 1)
			{
				var currActor = visibleActors[i];
				if (currActor === $entity) { continue; }
				actorsInfluences.push(influencesManager.getActorInfluence(currActor, AIComp.walkableCellsArray));
				//window.debug.coordData = actorsInfluences[actorsInfluences.length - 1];
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
						if (AIComp.getMemoryItem(currNeighbour.x, currNeighbour.y) === undefined) { return true; }
					}
				}
			};
			var edges = [];
			i = 0;
			length = AIComp.walkableCellsArray.length;
			var currMemory;
			
			var explorableCells = [];

			for (i; i < length; i += 1)
			{
				var currCell = AIComp.walkableCellsArray[i];
				if (isEdge(currCell)) { edges.push(currCell); }
			}
			var explorationInfluence = influencesManager.getExplorationInfluence($entity.ID, AIComp.walkableCellsArray, edges);


			//concatenating all current influences
			var influencesArray = [explorationInfluence];

			influencesArray = influencesArray.concat(actorsInfluences).concat(AIComp.cellInfluences);

			/*i = 0;
			k = 0;
			//retrieving influences from memory
			length = memory.length;
			for (i; i < length; i += 1)
			{
				var currInfluenceData = memory[i].influenceData;
				influencesArray = currInfluenceData.length > 0 ? influencesArray.concat(currInfluenceData) : influencesArray;
			}*/


			//aging memories
			i = 0;
			length = memory.length;
			for (i; i < length; i += 1)
			{
				currMemory = memory[i];
				currMemory.age += 1;
			}


			//choosing best neighbour in radius
			i = 0;
			var close = AIComp.walkableCellsMemory.getNeighboursInRadius(posComp.cell.x, posComp.cell.y, 5);
			close.push(AIComp.getMemoryItem(posComp.cell.x, posComp.cell.y));

			length = close.length;
			var highScore;
			var bestMemory;

			for (i; i < length; i += 1)
			{
				var currNeigh = close[i];
				
				var currScore = influencesManager.getOverallInfluenceScore(currNeigh.x, currNeigh.y, influencesArray, $entity);
				currNeigh.setInfluenceScore(currScore);

				if (!highScore || currScore > highScore)
				{
					highScore = currScore;
					bestMemory = currNeigh;
				}
			}

			var getWeight = function ($node)
			{
				return influencesManager.getMovementScore($node.x, $node.y, influencesArray, $entity);
			};

			//possible bug if the destination is unreachable
			//creating the astar path
			if (!AIComp.goal || highScore > AIComp.goal.getInfluenceScore())
			{
				AIComp.goal = bestMemory;

				var walkableMemory = AIComp.walkableCellsMemory;
				Astar.init(walkableMemory.array);
				var start = walkableMemory.getNodeAt(posComp.cell.x, posComp.cell.y);
				var end = walkableMemory.getNodeAt(AIComp.goal.x, AIComp.goal.y);
				
				var path = Astar.search(walkableMemory.graph, start, end, getWeight);
				posComp.path = path;
				posComp.currentStep = 0;
			}
			else
			{
				posComp.currentStep += 1;
			}
			
			if (AIComp.goal.cell !== posComp.cell) { posComp.nextStep = posComp.path[posComp.currentStep].cell; }

			//window.debug.sumInfluences(influencesArray, influencesManager.getMultiplier, $entity);
			//window.debug.memory = AIComp.getMemory();
			//window.debug.setCoordData(AIComp.walkableCellsMemory, 'influenceScore');
			//window.debug.sumInfluences(influencesArray, influencesManager.getMultiplier, $entity);
		}
	};
});