define(['libs/Astar'],
	function (Astar) {
	'use strict';

	return {
		init: function ($cell)
		{
			this.cell = $cell;
			this.x = this.cell.x;
			this.y = this.cell.y;
			this.age = 0;
			return this;
		},
		getInfluenceScore: function ()
		{
			return this._influenceScore;
		},
		setInfluenceScore: function ($score)
		{
			this._influenceScore = $score;
		}
	};
});