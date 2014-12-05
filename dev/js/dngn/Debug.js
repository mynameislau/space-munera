define(['dngn/CoordinatedData'],
	function (CoordinatedData) {
	'use strict';

	var debug = {

		init: function ()
		{
			window.debug = this;
			return this;
		},
		sumInfluences: function ($influencesArray, $addingFunction, $entity)
		{
			this.influence = new CoordinatedData();

			var i = 0;
			var length = $influencesArray.length;
			for (i; i < length; i += 1)
			{
				var currInf = $influencesArray[i];
				for (var k = 0, valuesLength = currInf.array.length; k < valuesLength; k += 1)
				{
					var currNode = currInf.array[k];
					var sumNode = this.influence.getNodeFromCoords(currNode.x, currNode.y);
					var multiplied = $addingFunction(currNode, currInf, $entity);
					if (!sumNode)
					{
						this.influence.addNode({value: multiplied, x: currNode.x, y: currNode.y}, currNode.x, currNode.y);
					}
					else
					{
						sumNode.value += multiplied;
					}
				}
			}
		}
	};

	return debug;
});