define(['ROT', 'dngn/Cell', 'event/Dispatcher', 'dngn/Graph', 'dngn/CoordinatedData'],
	function (ROT, Cell, Dispatcher, Graph, CoordinatedData) {
	'use strict';

	var Map = {

		_width: 80,
		_height: 25,

		init: function ()
		{
			this.dispatcher = Object.create(Dispatcher);

			this._cells = new CoordinatedData();

			this._invalidCells = [];
			//this.actorCells = [];

			this.invalidate();
		},
		generate: function ()
		{
			/*ROT.RNG.setSeed(12345);
			ROT.DEFAULT_WIDTH = 80;
			ROT.DEFAULT_HEIGHT = 30;*/
			var digger = new ROT.Map.Digger(this._width, this._height);

			var digCallback = function ($x, $y, $terrain) {
				var currCell = Object.create(Cell);
				currCell.init($x, $y, $terrain);
				this._cells.addItem(currCell, $x, $y);
				this.invalidate(currCell.key);
			};
			digger.create(digCallback.bind(this));
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
			var cell = this.getFreeCells().randomize().splice(0, 1)[0];
			this.addActorToCell(cell, $actor);
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
		getDist: function ($cell1, $cell2)
		{
			var xDist = Math.abs($cell1.x - $cell2.x);
			var yDist = Math.abs($cell1.y - $cell2.y);
			return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
		},
		getNeighbours: function ($cell)
		{
			return this._cells.graph.getNeighbours($cell.x, $cell.y);
		},
		getDijkstraMap: function ($array, $goals)
		{
			var coordData = new CoordinatedData();
			var dijArray = coordData.array;
			var dijGraph = coordData.graph;

			for (var i = 0, length = $array.length; i < length; i += 1)
			{
				var currCell = $array[i];
				if (currCell.isWalkable())
				{
					var dij = { cell: currCell, x: currCell.x, y: currCell.y, value: $goals.indexOf(currCell) !== -1 ? 0 : Infinity };
					coordData.addItem(dij, dij.x, dij.y);
				}
			}
			var dijArrayLength = dijArray.length;
			var changes;
			do
			{
				changes = 0;
				i = 0;
				for (i; i < dijArrayLength; i += 1)
				{
					var currDij = dijArray[i];
					var neighbours = dijGraph.getNeighbours(currDij.x, currDij.y);

					for (var k = 0, neighLength = neighbours.length; k < neighLength; k += 1)
					{
						var currNeighbour = neighbours[k];
						if (currDij.value > currNeighbour.value + 1)
						{
							changes += 1;
							currDij.value = currNeighbour.value + 1;
						}
					}
				}
			}
			while (changes > 0);
			return coordData;
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