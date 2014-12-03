define([],
	function () {
	'use strict';

	return {
		init: function ($x, $y, $terrain)
		{
			this.x = Number($x);
			this.y = Number($y);
			this.key = String($x) + ',' + String($y);
			this._terrain = $terrain;
			this._actors = [];
			//console.log('creating', $x, $y, $terrain);
		},
		getActors: function () { return this._actors; },
		addActor: function ($actor) { this._actors.push($actor); },
		removeActor: function ($actor) { this._actors.splice(this._actors.indexOf($actor, 1)); },
		getTerrain: function ($terrain) { return this._terrain; },
		setTerrain: function ($terrain) { this._terrain = $terrain; }
	};
});