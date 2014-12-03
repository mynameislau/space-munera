define(['ROT', 'dngn/Cell', 'event/Dispatcher', 'dngn/Graph', 'dngn/CoordinatedData'],
	function (ROT, Cell, Dispatcher, Graph, CoordinatedData) {
	'use strict';

	var Map = {

		init: function ()
		{
			this.dispatcher = Object.create(Dispatcher);

			this._width = 50;
			this._height = 50;
			this._cells = new CoordinatedData();

			this._invalidCells = [];
			//this.actorCells = [];

			this.invalidate();
		},
		generate: function ($mapString)
		{
			var initCell = function ($x, $y, $terrain)
			{
				var currCell = Object.create(Cell);
				currCell.init($x, $y, $terrain);
				this._cells.addNode(currCell, $x, $y);
				this.invalidate(currCell.key);
			};
			if ($mapString)
			{
				var lineBreak = /(\r\n|\n|\r)/gm;
				this._width = $mapString.search(lineBreak);
				$mapString = $mapString.replace(lineBreak, '');
				this._height = $mapString.length / this._width;
				console.log(this._width);
				console.log(this._height);

				for (var i = 0, mapLength = $mapString.length; i < mapLength; i += 1)
				{
					var currValue = $mapString[i];
					currValue = currValue === ' ' ? 0 : currValue;
					currValue = currValue === '0' ? 1 : currValue;
					initCell.call(this, i % this._width, Math.floor(i / this._width), currValue);
				}
			}
			else
			{
				/*ROT.RNG.setSeed(12345);
				ROT.DEFAULT_WIDTH = 80;
				ROT.DEFAULT_HEIGHT = 30;*/
				var digger = new ROT.Map.Digger(this._width, this._height);
				digger.create(initCell.bind(this));
			}

			//this.setBonuses();
		},
		setBonuses: function ()
		{
			//bonuses
			var i = 0;
			var length = 15;
			for (i; i < length; i += 1)
			{
				var bonus = 'W';
				if (i > 5) { bonus = 'F'; }
				if (i > 10) { bonus = 'H'; }
				this.changeTerrain(this.getFreeCells().randomize()[0], bonus);
			}
		},
		invalidate: function ($key)
		{
			this._freeCells = undefined;
			if ($key !== undefined) { this.dispatcher.fire('cellChange', $key); }
			//this.actorCells = undefined;
			//this.actors = undefined;
		},
		placeActor: function ($actor)
		{
			//var cell = this.getFreeCells().randomize()[0];
			var cell = this.getStartingPosition();
			this.addActorToCell(cell, $actor);
		},
		changeTerrain: function ($cell, $terrain)
		{
			$cell.setTerrain($terrain);
			this.invalidate($cell.key);
		},
		getStartingPosition: function ()
		{
			for (var i = 0, length = this._cells.array.length; i < length; i += 1)
			{
				var currCell = this._cells.array[i];
				if (currCell.getTerrain() === 'S') { return currCell; }
			}
		},
		addActorToCell: function ($cell, $actor)
		{
			this.removeActorFromCell($actor);
			$cell.addActor($actor);
			$actor.posComp.cell = $cell;
			this.invalidate($cell.key);
		},
		removeActorFromCell: function ($actor)
		{
			var cell = $actor.posComp.cell;
			if (!cell) { return; }
			cell.removeActor($actor);
			$actor.posComp.cell = undefined;
			this.invalidate(cell.key);
		},

		getCellFromActor: function ($actor)
		{
			for (var i = 0, length = this._cells.array.length; i < length; i += 1)
			{
				var currCell = this._cells.array[i];
				var index = currCell.getActors().indexOf($actor);
				if (index !== -1) { return currCell; }
			}
		},

		getCell: function ($key) { return this._cells.obj[$key]; },
		
		getCellFromCoords: function ($x, $y) { return this._cells.getNodeFromCoords($x, $y); },
		
		getCells: function () { return this._cells.obj; },

		getCellData: function () { return this._cells; },

		getCellsArray: function () { return this._cells.array; },

		//getActorCells: function () { return this.actorCells; },
		getCellsFromTerrain: function ($terrainType)
		{
			var toReturn = [];
			for (var i = 0, length = this._cells.array.length; i < length; i += 1)
			{
				var currCell = this._cells.array[i];
				if (currCell.getTerrain() === $terrainType) { toReturn.push(currCell); }
			}
			return toReturn;
		},

		getFreeCells: function ()
		{
			if (!this._freeCells)
			{
				this._freeCells = [];
				for (var i = 0, cellsLength = this._cells.array.length; i < cellsLength; i += 1)
				{
					var currCell = this._cells.array[i];
					if (currCell.getTerrain() === 0)
					{
						this._freeCells.push(currCell);
					}
				}
			}
			return this._freeCells;
		},
		getNeighbours: function ($cell)
		{
			return this._cells.graph.getNeighbours($cell.x, $cell.y);
		}
	};

	return Map;

});