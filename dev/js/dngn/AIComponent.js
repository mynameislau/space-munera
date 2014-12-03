define(['event/Dispatcher', 'dngn/CoordinatedData'],
	function (Dispatcher, CoordinatedData) {
	'use strict';

	return {
		init: function ()
		{
			this.dispatcher = Object.create(Dispatcher);
			this._memory = new CoordinatedData();
			this.destination = undefined;
			return this;
		},
		addMemoryItem: function ($item)
		{
			if (this._memory.getNodeFromKey($item.cell.key)) { return false; }
			this._memory.addNode($item, $item.cell.x, $item.cell.y);
			return true;
		},
		getMemoryItem: function ($key)
		{
			return this._memory.obj[$key];
		},
		getMemoryArray: function ()
		{
			return this._memory.array;
		},
		getMemory: function ()
		{
			return this._memory;
		},
		getMemoryNeighbours: function ($x, $y)
		{
			return this._memory.getNeighbours($x, $y);
		},
		setState: function ($state)
		{
			this._state = $state;
			this.dispatcher.fire('stateChanged');
		},
		getStateName: function ()
		{
			return this._state.name;
		}
	};
});