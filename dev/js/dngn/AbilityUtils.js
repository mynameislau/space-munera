define(['ROT'],
	function (ROT) {
	'use strict';

	var AbilityUtils;
	AbilityUtils = {
		canSeeThrough: function ($cell, $abilities)
		{
			return $cell.getTerrain() !== 1;
		},
		isWalkable: function ($cell, $abilities)
		{
			return $cell.getTerrain() !== 1;
		},
		getWalkableCells: function ($cells, $abilities)
		{
			var toReturn = [];
			for (var i = 0, length = $cells.length; i < length; i += 1)
			{
				var currCell = $cells[i];
				if (AbilityUtils.isWalkable(currCell, $abilities)) { toReturn.push(currCell); }
			}
			return toReturn;
		},
		getVisibilityData: function ($cellsData, $fromCell, $abilities)
		{
			var shadowCastingCallback = function ($xPos, $yPos)
			{
				var cell = $cellsData.getNodeFromCoords($xPos, $yPos);
				if (cell) { return AbilityUtils.canSeeThrough(cell, $abilities); }
			};
			var fov = new ROT.FOV.PreciseShadowcasting(shadowCastingCallback);

			var visibilityData = { data: [], cellsArray: [] };
			fov.compute($fromCell.x, $fromCell.y, $abilities.sight, function ($xPos, $yPos, $r, $visibility)
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