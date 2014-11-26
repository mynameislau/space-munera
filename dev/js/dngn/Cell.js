define([],
	function () {
	'use strict';

	return {
		init: function ($x, $y, $terrain)
		{
			this._x = Number($x);
			this._y = Number($y);
			this._key = String($x) + ',' + String($y);
			this._terrain = $terrain;
			this._actors = [];
		},
		
		getX: function () { return this._x; },
		getY: function () { return this._y; },
		getKey: function () { return this._key; },
		getActors: function () { return this._actors; },
		addActor: function ($actor) { this._actors.push($actor); },
		removeActor: function ($actor) { this._actors.splice(this._actors.indexOf($actor, 1)); },
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