define(['ROT'],
	function (ROT) {
	'use strict';

	var Display = {

		cellSize: 30,
		init: function ($map)
		{
			this._map = $map;
			this._map.dispatcher.on('cellChange', this.cellChangeHandler.bind(this));
			//this._ROTDisplay = new ROT.Display();
			this._context = document.getElementById('canvas').getContext('2d');
			this._cellsToDraw = {};
			console.log(this._context);
			//document.body.appendChild(this._ROTDisplay.getContainer());
		},
		cellChangeHandler: function ($key)
		{
			this._cellsToDraw[$key] = true;
		},
		drawCell: function ($cell, $text, $textColor, $cellColor)
		{
			var xPos = $cell.x * this.cellSize;
			var yPos = $cell.y * this.cellSize;
			this._context.strokeStyle = 'grey';
			this._context.fillStyle = $cellColor ? $cellColor : 'white';
			this._context.clearRect(xPos, yPos, this.cellSize, this.cellSize);
			this._context.fillRect(xPos, yPos, this.cellSize, this.cellSize);
			this._context.strokeRect(xPos, yPos, this.cellSize, this.cellSize);
			this._context.fillStyle = $textColor ? $textColor : 'black';
			this._context.font = '8pt monospace';
			this._context.fillText($text, xPos + 5, yPos + this.cellSize * 0.5 + 5);
		},
		draw: function ($map, $players)
		{
			var cells = this._cellsToDraw;
			
			for (var key in cells)
			{
				var currCell = $map.getCell(key);
				var parts = key.split(',');
				var x = parseInt(parts[0]);
				var y = parseInt(parts[1]);

				var toDraw = 0;
				switch (currCell.getTerrain())
				{
					case 1:
						toDraw = ' ';
						break;
					case '*':
						toDraw = 'b';
						break;
					case 0:
						toDraw = '.';
						break;
					default:
						toDraw = currCell.getTerrain();
						break;
				}
				if (currCell.getActors().length >= 1) { toDraw = '@'; }
				this.drawCell(currCell, toDraw);
				//this._ROTDisplay.draw(x, y, toDraw);
			}
			this._cellsToDraw = {};



			/******* test *****/

			/*var actor = $players[0];
			var actorHistoryData = actor.AIComp.history;
			for (var i = 0, length = actorHistoryData.length; i < length; i += 1)
			{
				var currScore = actorHistoryData[i];
				var cell = this._map.getCell(currScore.key);
				if (currScore.exploration > 900)
				{
					this._ROTDisplay.draw(cell.x, cell.y, 'x', '#fff', 'red');
				}
				else if (currScore.exploration === Number.NEGATIVE_INFINITY)
				{
					this._ROTDisplay.draw(cell.x, cell.y, '@', '#fff', 'yellow');
				}
				else
				{
					this._ROTDisplay.draw(cell.x, cell.y, 'o', 'grey', 'black');
				}
			}*/

			/******** dijkstra map ********/

			var dijkstraMap = $players[0].AIComp.degueu;
			var i = 0;
			var length = dijkstraMap.array.length;
			for (i; i < length; i += 1)
			{
				var currDijk = dijkstraMap.array[i];
				var textVal = currDijk.value.toString().substr(0, 3);
				this.drawCell(currDijk.cell, textVal, 'black', 'hsl(' + currDijk.value * 255 + ', 80%, 80%)');
				//this._ROTDisplay.draw(currDijk.cell.x, currDijk.cell.y, Math.round(currDijk.value / 16), 'white', 'black');
			//	this._ROTDisplay.draw(currDijk.cell.x, currDijk.cell.y, ' ', 'white', 'hsl(120, 0%, ' + currDijk.value * 100 + '%)');
			}
			this.drawCell($players[0].posComp.cell, '@', 'white', 'red');
			//this._ROTDisplay.draw($players[0].posComp.cell.x, $players[0].posComp.cell.y, '@', 'white', 'yellow');
			/*var edges = $players[0].AIComp.edges;
			i = 0;
			length = edges.length;
			for (i; i < length; i += 1)
			{
				var currEdge = edges[i];
				this._ROTDisplay.draw(currEdge.x, currEdge.y, 'x', 'white', 'red');
			}*/




			//debugger;

			/*var actorCells = $map.getActorCells();
			for (var i = 0, actorsLength = actorCells.length; i < actorsLength; i += 1)
			{
				var currActorCell = actorCells[i];

				var visiData = $map.getVisibilityData(currActorCell.key);
				for (key in visiData.visibleCells)
				{
					var currCell = visiData.visibleCells[key];
					var ch = (currCell.r ? '' : '@');
					var color = $map.getCells()[key].lightPasses() ? '#aa0': '#660';
					this._ROTDisplay.draw(currCell.x, currCell.y, ch, '#fff', color);
				}
				for (key in visiData.farestWalkables)
				{
					var currFarest = visiData.farestWalkables[key];
					this._ROTDisplay.draw(currFarest.x, currFarest.y, 'x', '#fff', '#ff0000');
				}
			}*/
		}
		
	};

	return Display;

});