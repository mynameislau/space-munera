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
			this._drawnActorCells = [];
			//document.body.appendChild(this._ROTDisplay.getContainer());
		},
		cellChangeHandler: function ($key)
		{
			this._cellsToDraw[$key] = true;
		},
		drawCell: function ($x, $y, $text, $textColor, $cellColor)
		{
			var xPos = $x * this.cellSize;
			var yPos = $y * this.cellSize;
			this._context.strokeStyle = '#4e5a4f';
			this._context.fillStyle = $cellColor ? $cellColor : 'black';
			this._context.clearRect(xPos, yPos, this.cellSize, this.cellSize);
			this._context.fillRect(xPos, yPos, this.cellSize, this.cellSize);
			this._context.strokeRect(xPos, yPos, this.cellSize, this.cellSize);
			this._context.fillStyle = $textColor ? $textColor : 'black';
			this._context.font = '8pt monospace';
			this._context.fillText($text, xPos + 5, yPos + this.cellSize * 0.5 + 5);
		},
		drawActor: function ($actor)
		{
			var cell = $actor.posComp.cell;
			if (this._drawnActorCells.indexOf(cell) !== -1) { return; }
			for (var i = 0, length = cell.getActors().length; i < length; i += 1)
			{
				var xPos = cell.x * this.cellSize;
				var yPos = cell.y * this.cellSize;
				var currActor = cell.getActors()[i];
				var teamColor = currActor.ordersComp.team === 'player' ? 100 : 0;
				var isUnit = currActor.bodyComp.bodyType === 'unit';
				this._context.fillStyle = 'hsl(' + (-100 + teamColor + currActor.bodyComp.health.value * 100) + ', 100%, 50%)';
				this._context.beginPath();
				if (isUnit)
				{
					var rad = 3;
					var maxSize = this.cellSize - 2 * rad;
					var totalSize = Math.min(maxSize, rad * 2 * length);
					var uXPos = rad + xPos + maxSize * 0.5 + totalSize * (i / length) - totalSize * 0.5;
					var uYPos = yPos + rad + maxSize * 0.5 - totalSize * 0.5 + Math.random() * totalSize * 0.5;
					this._context.arc(uXPos, uYPos, 3, 0, 2 * Math.PI);
				}
				else
				{
					this._context.fillRect(xPos + this.cellSize * 0.5 - 5, yPos + this.cellSize * 0.5 - 5, 10, 10);
				}
				this._context.fill();
			}
			this._cellsToDraw[cell.key] = true;
			this._drawnActorCells.push(cell);
		},
		draw: function ($map, $actors)
		{
			var cells = this._cellsToDraw;
			this._drawnActorCells = [];
			
			for (var key in cells)
			{
				var currCell = $map.getCell(key);
				var parts = key.split(',');
				var x = parseInt(parts[0]);
				var y = parseInt(parts[1]);

				var toDraw = 0;
				var cellColor = 'black';
				switch (currCell.getTerrain())
				{
					case 1:
						toDraw = ' ';
						break;
					case '*':
						toDraw = 'b';
						break;
					case 0:
						toDraw = ' ';
						cellColor = '#252b26';
						break;
					default:
						toDraw = currCell.getTerrain();
						cellColor = '#252b26';
						break;
				}
				this.drawCell(currCell.x, currCell.y, toDraw, '#24e33a', cellColor);
				//this._ROTDisplay.draw(x, y, toDraw);
			}
			this._cellsToDraw = {};



			/******* test *****/

			/*var actor = $actors[0];
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
			
			var i = 0;
			var length;
			var coordData = window.debug.influence || window.debug.memory;
			if (coordData)
			{
				length = coordData.array.length;
				for (i; i < length; i += 1)
				{
					var curr = coordData.array[i];
					if (window.debug.influence)
					{
						var textVal = curr.value.toString().substr(0, 4);
						this.drawCell(curr.x, curr.y, textVal, 'black', 'hsla(' + curr.value * 255 + ', 80%, 80%, 0.5)');
					}
					else
					{
						this._cellsToDraw[curr.cell.key] = true;
						this.drawCell(curr.cell.x, curr.cell.y, ' ', 'black', 'white');
					}
					//this._ROTDisplay.draw(curr.cell.x, curr.cell.y, Math.round(curr.value / 16), 'white', 'black');
				//	this._ROTDisplay.draw(curr.cell.x, curr.cell.y, ' ', 'white', 'hsl(120, 0%, ' + curr.value * 100 + '%)');
				}
			}
			

			i = 0;
			length = $actors.length;
			for (i; i < length; i += 1)
			{
				var currPlayer = $actors[i];
				var playerPos = currPlayer.posComp.cell;
				this.drawActor(currPlayer);
			}
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