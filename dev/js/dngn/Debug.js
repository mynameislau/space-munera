define(['dngn/CoordinatedData'],
	function (CoordinatedData) {
	'use strict';

	var debug = {

		init: function ()
		{
			window.debug = this;
			return this;
		},
		setCoordData: function ($coordData, $evaluationType, $evalFunction)
		{
			console.log($coordData);
			this.coordData = $coordData;
			this.evaluationType = $evaluationType;
			this.coordDataEvalFunction = $evalFunction;
		},
		sumInfluences: function ($influencesArray, $addingFunction, $entity)
		{
			this.coordData = new CoordinatedData();

			var i = 0;
			var length = $influencesArray.length;
			for (i; i < length; i += 1)
			{
				var currInf = $influencesArray[i];
				for (var k = 0, valuesLength = currInf.array.length; k < valuesLength; k += 1)
				{
					var currNode = currInf.array[k];
					var sumNode = this.coordData.getNodeFromCoords(currNode.x, currNode.y);
					var multiplied = $addingFunction(currInf, currNode.x, currNode.y, $entity);
					if (!sumNode)
					{
						this.coordData.addNode({value: multiplied, x: currNode.x, y: currNode.y}, currNode.x, currNode.y);
					}
					else
					{
						sumNode.value += multiplied;
					}
				}
			}
			this.evaluationType = 'influencesSum';
		}
	};

	return debug;
});