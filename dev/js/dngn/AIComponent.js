define(['event/Dispatcher', 'dngn/CoordinatedData', 'dngn/CellMemory'],
	function (Dispatcher, CoordinatedData, CellMemory) {
	'use strict';

	return {
		init: function ()
		{
			this.dispatcher = Object.create(Dispatcher);
			this._memory = new CoordinatedData();
			this.walkableCellsMemory = new CoordinatedData();
			this.walkableCellsArray = [];
			this.destination = undefined;
			this.cellInfluences = [];
			this.goal = undefined;

			return this;
		},
		addMemoryItem: function ($cell, $isWalkable)
		{
			var isNew = false;
			var memoryItem = this.getMemoryItem($cell.x, $cell.y);
			if (!memoryItem)
			{
				isNew = true;
				memoryItem = Object.create(CellMemory).init($cell);
				this._memory.addNode(memoryItem, $cell.x, $cell.y);
				if ($isWalkable)
				{
					this.walkableCellsMemory.addNode(memoryItem, $cell.x, $cell.y);
					this.walkableCellsArray.push(memoryItem.cell);
				}
			}
			return isNew;
		},
		addCellInfluence: function ($cellInfluences)
		{
			if ($cellInfluences) { Array.prototype.push.apply(this.cellInfluences, $cellInfluences); }
		},
		getMemoryItem: function ($x, $y)
		{
			return this._memory.getNodeFromCoords($x, $y);
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
			return this._memory.getNeighboursInRadius($x, $y, 5);
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