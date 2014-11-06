define(['ROT', 'dngn/Cell'],
	function (ROT, Cell) {
	'use strict';

	var Map = {

		generate: function () {

			this.cells = {};

			this.invalidate();

			var digger = new ROT.Map.Digger();

			var digCallback = function ($x, $y, $terrain) {
				var currCel = Object.create(Cell);
				currCel.init($x, $y, $terrain);
				this.cells[currCel.getKey()] = currCel;
			};
			digger.create(digCallback.bind(this));
		},
		invalidate: function ()
		{
			this.freeCells = undefined;
			this.cellsVisibleData = {};
			this.actorCells = undefined;
		},
		placePlayer: function ($player)
		{
			//random position for player
			var cell = this.getFreeCells().splice(0, 1)[0];
			this.addActorToCell(cell, $player);
			// $player.x = Number(key.split(',')[0]);
			// $player.y = Number(key.split(',')[1]);
			// $player.key = key;
		},
		moveActorToCell: function ($oldCell, $newCell)
		{
			var actor = $oldCell.getActor();
			this.deleteActorFromCell($oldCell);
			this.addActorToCell($newCell, actor);
		},
		addActorToCell: function ($cell, $actor)
		{
			$cell.setActor($actor);
			$actor.setCell($cell);
			this.invalidate();
		},
		deleteActorFromCell: function ($cell)
		{
			$cell.setActor(undefined);

			this.invalidate();
		},
		getCell: function ($key) {return this.cells[$key]; },
		
		getCellFromCoords: function ($x, $y) { return this.getCell($x + ',' + $y); },
		
		getCells: function () { return this.cells; },

		getActorCells: function ()
		{
			if (!this.actorCells)
			{
				this.actorCells = [];
				for (var key in this.cells)
				{
					var actor = this.cells[key].getActor();
					if (actor)
					{
						this.actorCells.push(this.cells[key]);
					}
				}
			}
			return this.actorCells;
		},
		getFreeCells: function ()
		{
			if (!this.freeCells)
			{
				this.freeCells = [];
				for (var key in this.cells)
				{
					if (this.cells[key].isWalkable())
					{
						this.freeCells.push(this.cells[key]);
					}
				}
			}
			return this.freeCells;
		},
		getVisibilityData: function ($key)
		{
			var data = this.cellsVisibleData[$key];
			if (!data)
			{
				var cell = this.cells[$key];
				/* input callback */
				var cells = this.cells;
				var lightPasses = function (x, y) {
					var key = x + ',' + y;
					if (key in cells) { return cells[key].lightPasses(); }
					return false;
				};

				var fov = new ROT.FOV.PreciseShadowcasting(lightPasses.bind(this));

				var farestWalkables = [];
				var visibleCells = {};
				fov.compute(cell.getX(), cell.getY(), 10, function (x, y, r, visibility) {
					/*var xDist = Math.abs(stp.x - x);
					var yDist = Math.abs(stp.y - y);
					var hyp = Math.sqrt(Math.pow(xDist, 2), Math.pow(yDist, 2));*/
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
					var currCell = this.getCell(key);
					if (currCell.isWalkable())
					{
						var xPos = currCell.getX();
						var yPos = currCell.getY();

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
				data = this.cellsVisibleData[$key] = { visibleCells: visibleCells, farestWalkables: farestWalkables };
			}

			return data;
		}
		
	};

	return Map;

});