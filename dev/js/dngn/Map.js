define(['ROT', 'dngn/Cell', 'event/Dispatcher', 'dngn/Graph', 'dngn/CoordinatedData'],
	function (ROT, Cell, Dispatcher, Graph, CoordinatedData) {
	'use strict';

	var Map = {

		init: function ()
		{
			this.dispatcher = Object.create(Dispatcher);

			this._width = 80;
			this._height = 25;
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
				this._cells.addItem(currCell, $x, $y);
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

			this.generateStaticInfluences();
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
			//var cell = this.getFreeCells().randomize().splice(0, 1)[0];
			var cell = this.getStartingPosition();
			this.addActorToCell(cell, $actor);
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
		
		getCellFromCoords: function ($x, $y) { return this._cells.getItemFromCoords($x, $y); },
		
		getCells: function () { return this._cells.obj; },

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
					if (currCell.isWalkable())
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
		},
		getVisibilityData: function ($cell)
		{
			var lightPasses = function (x, y) {
				var cell = this.getCellFromCoords(x, y);
				return cell ? cell.lightPasses() : false;
			};

			var fov = new ROT.FOV.PreciseShadowcasting(lightPasses.bind(this));

			var visibleCells = [];
			fov.compute($cell.x, $cell.y, 10, function (x, y, r, visibility) {
				/*var xDist = Math.abs(stp.x - x);
				var yDist = Math.abs(stp.y - y);
				var hyp = Math.sqrt(Math.pow(xDist, 2), Math.pow(yDist, 2));*/
				var cell = this.getCellFromCoords(x, y);
				if (!cell) { return; }
				visibleCells.push({ cell: cell, r: r, visibility: visibility });
				//var currCell = this.getCellFromCoords(x, y);
				// if (currCell.isWalkable())
				// {
				// 	farestWalkable = currCell;
				// }
			}.bind(this));
			
			return visibleCells;
		}
		
	};

	return Map;

});