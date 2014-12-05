define(['ROT'],
	function (ROT) {
	'use strict';

	var AbilityUtils;
	AbilityUtils = {
		canSeeThrough: function ($cell, $entity)
		{
			for (var i = 0, length = $cell.getActors().length; i < length; i += 1)
			{
				var currActor = $cell.getActors()[i];
				if (currActor.bodyComp.bodyType === 'door' && currActor.ordersComp.team !== $entity.ordersComp.team) { return false; }
			}
			return $cell.getTerrain() !== 1;
		},
		isWalkable: function ($cell, $entity)
		{
			for (var i = 0, length = $cell.getActors().length; i < length; i += 1)
			{
				var currActor = $cell.getActors()[i];
				if (currActor.bodyComp.bodyType === 'door' && currActor.ordersComp.team !== $entity.ordersComp.team) { return false; }
			}
			return $cell.getTerrain() !== 1;
		},
		getWalkableCells: function ($cells, $entity)
		{
			var toReturn = [];
			for (var i = 0, length = $cells.length; i < length; i += 1)
			{
				var currCell = $cells[i];
				if (AbilityUtils.isWalkable(currCell, $entity)) { toReturn.push(currCell); }
			}
			return toReturn;
		},
		getVisibilityData: function ($cellsData, $fromCell, $entity)
		{
			var shadowCastingCallback = function ($xPos, $yPos)
			{
				var cell = $cellsData.getNodeFromCoords($xPos, $yPos);
				if (cell) { return AbilityUtils.canSeeThrough(cell, $entity); }
			};
			var fov = new ROT.FOV.PreciseShadowcasting(shadowCastingCallback);

			var visibilityData = { data: [], cellsArray: [] };
			fov.compute($fromCell.x, $fromCell.y, $entity.bodyComp.sight, function ($xPos, $yPos, $r, $visibility)
			{
				var cell = $cellsData.getNodeFromCoords($xPos, $yPos);
				if (cell)
				{
					visibilityData.data.push({ cell: cell, r: $r, visibility: $visibility });
					visibilityData.cellsArray.push(cell);
				}
			});

			return visibilityData;
		}
	};
	return AbilityUtils;
});