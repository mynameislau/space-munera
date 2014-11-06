define([],
	function () {
	'use strict';

	return {
		init: function ($x, $y, $terrain)
		{
			this._x = Number($x);
			this._y = Number($y);
			this._key = $x + ',' + $y;
			this._terrain = $terrain;
			this._actor = undefined;
		},
		
		getX: function () { return this._x; },
		getY: function () { return this._y; },
		getKey: function () { return this._key; },
		getActor: function ($actor) { return this._actor; },
		setActor: function ($actor) { this._actor = $actor; },
		getTerrain: function ($terrain) { return this._terrain; },
		setTerrain: function ($terrain) { this._terrain = $terrain; },

		lightPasses: function ()
		{
			return this._terrain !== 1;
		},
		isWalkable: function ()
		{
			return this._terrain === 0;
		}
	};
});