define(['ROT', 'dngn/Cell', 'event/Dispatcher', 'dngn/Graph', 'dngn/CoordinatedData', 'libs/Astar'],
	function (ROT, Cell, Dispatcher, Graph, CoordinatedData, Astar) {
	'use strict';

	var Map = {

		init: function ()
		{
			this.dispatcher = Object.create(Dispatcher);

			this.width = 50;
			this.height = 50;
			this._cells = new CoordinatedData();

			this._invalidCells = [];
			//this.actorCells = [];

			this.invalidate();

			return this;
		},
		generate: function ($parsed)
		{
			var initCell = function ($x, $y, $terrain)
			{
				var currCell = Object.create(Cell);
				currCell.init($x, $y, $terrain);
				this._cells.addNode(currCell, $x, $y);
				this.invalidate(currCell);
			};
			if ($parsed)
			{
				this.width = $parsed.width;
				this.height = $parsed.height;

				for (var i = 0, mapLength = $parsed.mapArray.length; i < mapLength; i += 1)
				{
					var currValue = $parsed.mapArray[i];
					
					initCell.call(this, currValue.x, currValue.y, currValue.terrain);
				}
			}
			else
			{
				/*ROT.RNG.setSeed(12345);
				ROT.DEFAULT_WIDTH = 80;
				ROT.DEFAULT_HEIGHT = 30;*/
				var digger = new ROT.Map.Digger(this.width, this.height);
				digger.create(initCell.bind(this));
			}

			var date = Date.now();
			(function () {
				var coordTestData = new CoordinatedData();
				var i = 0;
				var length = this.getCellsArray().length;
				for (i; i < length; i += 1)
				{
					var currCell = this.getCellsArray()[i];
					if (currCell.getTerrain() === 1) { continue; }
					coordTestData.addNode({value: Infinity, x: currCell.x, y: currCell.y}, currCell.x, currCell.y);
				}
				console.log(coordTestData.breadthFirstMapping(5, 5));
				window.debug.setCoordData(coordTestData, 'values');

			}.bind(this))();
			console.log(Date.now() - date);

			/*(function () {
				var coordTestData = new CoordinatedData();
				var i = 0;
				var length = this.getCellsArray().length;
				for (i; i < length; i += 1)
				{
					var currCell = this.getCellsArray()[i];
					coordTestData.addNode({weight: 1, x: currCell.x, y: currCell.y}, currCell.x, currCell.y);
				}
				var neighbours = coordTestData.getNeighboursInRadius(10, 0, 5);
				console.log(neighbours.length);

				i = 0;
				length = neighbours.length;
				for (i; i < length; i += 1)
				{
					var currNeigh = neighbours[i];
					currNeigh.weight = 1;
				}
				console.log(Astar);
				Astar.init(coordTestData.array);
				var start = coordTestData.getNodeFromCoords(0, 19);
				var end = coordTestData.getNodeFromCoords(19, 0);
				console.log(start, end);
				var path = Astar.search(coordTestData.graph, start, end);

				i = 0;
				length = path.length;
				for (i; i < length; i += 1)
				{
					var pathNode = path[i];
					pathNode.value = 100;
				}
				window.debug.coordData = coordTestData;
			}.bind(this))();*/
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
		invalidate: function ($cell)
		{
			this._freeCells = undefined;
			if ($cell !== undefined) { this.dispatcher.fire('cellChange', $cell); }
			//this.actorCells = undefined;
			//this.actors = undefined;
		},
		placeActor: function ($actor, $position)
		{
			var cell;
			if ($position)
			{
				cell = this.getCellFromCoords($position.x, $position.y);
			}
			else
			{
				//cell = this.getFreeCells().randomize()[0];
				cell = this.getStartingPosition($actor.ordersComp.team);
			}
			
			this.addActorToCell(cell, $actor);
		},
		changeTerrain: function ($cell, $terrain)
		{
			$cell.setTerrain($terrain);
			this.invalidate($cell);
		},
		getStartingPosition: function ($team)
		{
			for (var i = 0, length = this._cells.array.length; i < length; i += 1)
			{
				var currCell = this._cells.array[i];
				if (currCell.getTerrain() === 'S' && $team === 'player') { return currCell; }
				else if (currCell.getTerrain() === '±' && $team	 === 'enemy') { return currCell; }
			}
		},
		addActorToCell: function ($cell, $actor)
		{
			this.removeActorFromCell($actor);
			$cell.addActor($actor);
			$actor.posComp.cell = $cell;
			this.invalidate($cell);
		},
		removeActorFromCell: function ($actor)
		{
			var cell = $actor.posComp.cell;
			if (!cell) { return; }
			cell.removeActor($actor);
			$actor.posComp.cell = undefined;
			this.invalidate(cell);
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