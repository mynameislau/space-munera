define(['ROT', 'dngn/Cell', 'event/Dispatcher'],
	function (ROT, Cell, Dispatcher) {
	'use strict';

	var Map = {

		_width: 80,
		_height: 25,

		init: function ()
		{
			this.dispatcher = Object.create(Dispatcher);

			this._cells = {};
			this._cellsArray = [];
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
				var currCel = Object.create(Cell);
				currCel.init($x, $y, $terrain);
				this._cells[currCel.getKey()] = currCel;
				this._cellsArray.push(currCel);
				this.invalidate(currCel.getKey());
			};
			digger.create(digCallback.bind(this));
		},
		invalidate: function ($key)
		{
			this._freeCells = undefined;
			this._cellsVisibleData = {};
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
			$actor.setCell($cell);
			this.invalidate($cell.getKey());
		},
		removeActorFromCell: function ($actor)
		{
			var cell = $actor.getCell();
			if (!cell) { return; }
			cell.removeActor($actor);
			$actor.setCell(undefined);
			this.invalidate(cell.getKey());
		},

		getCell: function ($key) { return this._cells[$key]; },
		
		getCellFromCoords: function ($x, $y) { return this._cells[$x + ',' + $y]; },
		
		getCells: function () { return this._cells; },

		getCellsArray: function () { return this._cellsArray; },

		//getActorCells: function () { return this.actorCells; },

		getFreeCells: function ()
		{
			if (!this._freeCells)
			{
				this._freeCells = [];
				for (var i = 0, cellsLength = this._cellsArray.length; i < cellsLength; i += 1)
				{
					var currCell = this._cellsArray[i];
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
			var xDist = Math.abs($cell1.getX() - $cell2.getX());
			var yDist = Math.abs($cell1.getY() - $cell2.getY());
			return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
		},
		getNeighbors: function ($key)
		{
			var neighbors = [];
			var cell = this._cells[$key];
			var xPos = cell.getX();
			var yPos = cell.getY();
			var toPush;
			var condPush = function ($x, $y) {
				var toPush = this._cells[$x + ',' + $y];
				if (toPush) { neighbors.push(toPush); }
			};
			condPush(xPos - 1, yPos - 1);
			condPush(xPos + 0, yPos - 1);
			condPush(xPos + 1, yPos - 1);
			condPush(xPos + 1, yPos + 0);
			condPush(xPos + 1, yPos + 1);
			condPush(xPos + 0, yPos + 1);
			condPush(xPos - 1, yPos + 1);
			condPush(xPos - 1, yPos + 0);
			return neighbors;
		},
		getVisibilityData: function ($key)
		{
			var data = this._cellsVisibleData[$key];
			if (!data)
			{
				var cell = this._cells[$key];
				/* input callback */
				var cells = this._cells;
				var lightPasses = function (x, y) {
					var cell = this.getCellFromCoords(x, y);
					return cell ? cell.lightPasses() : false;
				};

				var fov = new ROT.FOV.PreciseShadowcasting(lightPasses.bind(this));

				var farestWalkables = [];
				var visibleCells = {};
				fov.compute(cell.getX(), cell.getY(), 10, function (x, y, r, visibility) {
					/*var xDist = Math.abs(stp.x - x);
					var yDist = Math.abs(stp.y - y);
					var hyp = Math.sqrt(Math.pow(xDist, 2), Math.pow(yDist, 2));*/
					if (x < 0 || x > this._width - 1 || y < 0 || y > this._height - 1) { return; }
					visibleCells[x + ',' + y] = ({ x: x, y: y, r: r, visibility: visibility });
					//var currCell = this.getCellFromCoords(x, y);
					// if (currCell.isWalkable())
					// {
					// 	farestWalkable = currCell;
					// }
				}.bind(this));
				for (var key in visibleCells)
				{
					var currVisiData = visibleCells[key];
					var currCell = this._cells[key];
					if (!currCell) { console.log(key, currCell, this._cells); }
					if (currCell.isWalkable())
					{
						var xPos = currCell.getX();
						var yPos = currCell.getY();

						if (key === $key) { continue; }

						//pas beau !!!!!
						if (!visibleCells[String(xPos - 1) + ',' + String(yPos - 1)] ||
							!visibleCells[String(xPos + 0) + ',' + String(yPos - 1)] ||
							!visibleCells[String(xPos + 1) + ',' + String(yPos - 1)] ||
							!visibleCells[String(xPos + 1) + ',' + String(yPos + 0)] ||
							!visibleCells[String(xPos + 1) + ',' + String(yPos + 1)] ||
							!visibleCells[String(xPos + 0) + ',' + String(yPos + 1)] ||
							!visibleCells[String(xPos - 1) + ',' + String(yPos + 1)] ||
							!visibleCells[String(xPos - 1) + ',' + String(yPos + 0)]
						) {
							farestWalkables.push(currCell);
						}
					}
				}
				data = this._cellsVisibleData[$key] = { visibleCells: visibleCells, farestWalkables: farestWalkables };
			}

			return data;
		}
		
	};

	return Map;

});