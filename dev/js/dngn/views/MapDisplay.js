define(['jquery', 'ROT', 'dngn/CoordinatedData', 'event/Dispatcher'],
	function (jquery, ROT, CoordinatedData, Dispatcher) {
	'use strict';

	return {

		init: function ($map, $engine, $entitiesManager)
		{
			this.cellSize = 30;
			this.dispatcher = Object.create(Dispatcher);

			$engine.dispatcher.on('loop', this.draw.bind(this));
			//this.display.draw(this.managers.map, this._entities);

			this._map = $map;
			this._entitiesManager = $entitiesManager;

			this._map.dispatcher.on('cellChange', this.invalidateCell.bind(this));
			//this._ROTDisplay = new ROT.Display();
			this._canvas = $('#canvas');
			this.cellSize = Math.floor(Math.min(this._canvas.width() / this._map.width, this._canvas.height() / this._map.height));
			this._canvas.on('click', this.canvasClickHandler.bind(this));

			this._context = this._canvas[0].getContext('2d');
			this._context.fillStyle = 'black';
			this._context.fillRect(0, 0, this._canvas.width(), this._canvas.height());
			this._cellsToDraw = [];
			this._drawnActorCells = [];
			this._cellDisplayData = new CoordinatedData();

			var cellsArray = this._map.getCellsArray();
			for (var i = 0, length = cellsArray.length; i < length; i += 1)
			{
				var currCell = cellsArray[i];
				var cellColor = 'hsl(0, 10%, ' + (12 + Math.random() * 5) + '%)';
				var toDraw = currCell.getTerrain();
				var textColor = 'black';
				var bigText = false;

				switch (currCell.getTerrain())
				{
					case 1:
						toDraw = ' ';
						continue;
					case '*':
						toDraw = 'b';
						break;
					case '∆':
						cellColor = '#0d004c';
						textColor = '#6164ff';
						bigText = true;
						break;
					case 'H':
						cellColor = '#197524';
						textColor = '#07ed22';
						bigText = true;
						break;
					case 0:
						toDraw = ' ';
						break;
					default:
						toDraw = currCell.getTerrain();
						break;
				}
				var displayData = {cell: currCell, cellColor: cellColor, text: toDraw, textColor: textColor, x: currCell.x, y: currCell.y, big: bigText };
				this._cellDisplayData.addNode(displayData, currCell.x, currCell.y);
				this._cellsToDraw.push(displayData);
			}
			//document.body.appendChild(this._ROTDisplay.getContainer());
		},
		invalidateCell: function ($cell)
		{
			this._cellsToDraw.push(this._cellDisplayData.getNodeAt($cell.x, $cell.y));
		},
		getXPosition: function ($x)
		{
			return $x * this.cellSize;
		},
		getYPosition: function ($y)
		{
			return $y * this.cellSize - 1;
		},
		drawCell: function ($x, $y, $text, $textColor, $cellColor, $bigText)
		{
			var xPos = this.getXPosition($x);
			var yPos = this.getYPosition($y);
			this._context.strokeStyle = '#4e5a4f';
			this._context.fillStyle = $cellColor ? $cellColor : 'black';
			this._context.clearRect(xPos, yPos, this.cellSize, this.cellSize);
			this._context.fillRect(xPos, yPos, this.cellSize, this.cellSize);
			//this._context.strokeRect(xPos + 0.5, yPos + 0.5, this.cellSize, this.cellSize);
			this._context.fillStyle = $textColor ? $textColor : 'black';
			this._context.font = $bigText ? '18pt monospace' : '8pt monospace';
			this._context.fillText($text, xPos + 5, yPos + this.cellSize * 0.5 + 5);
		},
		drawActor: function ($actor)
		{
			var cell = $actor.posComp.cell;
			if (this._drawnActorCells.indexOf(cell) !== -1) { return; }
			for (var i = 0, length = cell.getActors().length; i < length; i += 1)
			{
				var xPos = this.getXPosition(cell.x);
				var yPos = this.getYPosition(cell.y);
				var currActor = cell.getActors()[i];
				var teamColor = currActor.ordersComp.team === 'player' ? 100 : 0;
				var isUnit = currActor.bodyComp.bodyType === 'unit';
				this._context.beginPath();
				this._context.fillStyle = 'hsl(' + (-100 + teamColor + currActor.bodyComp.health.value * 100) + ', 100%, 50%)';
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
			this.invalidateCell(cell);
			this._drawnActorCells.push(cell);
		},
		draw: function ()
		{
			var cells = this._cellsToDraw;
			this._drawnActorCells = [];
			
			var i = 0;
			var length = cells.length;
			for (i; i < length; i += 1)
			{
				var currData = cells[i];
				this.drawCell(currData.x, currData.y, currData.text, currData.textColor, currData.cellColor, currData.big);
			}
			this._cellsToDraw = [];

			/******** debug ********/
			
			i = 0;
			var coordData = window.debug.coordData;
			var evaluationType = window.debug.evaluationType;
			var evalFunction = window.debug.coordDataEvalFunction;

			//console.log(coordData);
			if (coordData)
			{
				length = coordData.array.length;
				var max = 0;
				var curr;
				for (i; i < length; i += 1)
				{
					curr = coordData.array[i];
					max = curr.value > max ? curr.value : max;
				}
				i = 0;
				for (i; i < length; i += 1)
				{
					curr = coordData.array[i];
					if (evaluationType === 'influencesSum' || evaluationType === 'values')
					{
						var textVal = curr.value.toString().substr(0, 4);
						/*var totalVal = curr.value * 305;
						var LVal = totalVal * 0.164;*/
						var colorPart = curr.value / max * 1.33333;
						var lumPart = Math.max(0, curr.value / max - 0.75) * 4;
						var LVal = 50 + lumPart * 50;
						var HVal = 255 - colorPart * 255;
						this.drawCell(curr.x, curr.y, textVal, 'black', 'hsl(' + HVal + ', 100%, ' + LVal + '%)');
					}
					else if (evaluationType === 'weight')
					{
						var evaluation = evalFunction(curr);
						var weightVal = evaluation !== undefined ? evaluation : 0;
						this.drawCell(curr.x, curr.y, evaluation, 'black', 'hsl(' + weightVal * 255 + ', 100%, 50%');
					}
					else if (evaluationType === 'influenceScore')
					{
						var val = curr.getInfluenceScore() !== undefined ? curr.getInfluenceScore() : 0;
						this.drawCell(curr.x, curr.y, curr.getInfluenceScore(), 'black', 'hsl(' + val * 255 + ', 100%, 50%');
					}
					/*else if (curr.getInfluenceScore && curr.getInfluenceScore())
					{
						var score = curr.getInfluenceScore();
						this.drawCell(curr.x, curr.y, score, 'black', 'hsl(' + score * 255 + ', 100%, 50%)');
					}*/
					/*else
					{
						//this.drawCell(curr.cell.x, curr.cell.y, ' ', 'black', 'white');
					}*/
					//this._ROTDisplay.draw(curr.cell.x, curr.cell.y, Math.round(curr.value / 16), 'white', 'black');
				//	this._ROTDisplay.draw(curr.cell.x, curr.cell.y, ' ', 'white', 'hsl(120, 0%, ' + curr.value * 100 + '%)');
				}
			}

			/****** path debug *******/
			if (window.debug.path)
			{
				var path = window.debug.path;
				this._context.beginPath();
				this._context.strokeStyle = 'blue';
				i = 0;
				length = path.length;
				for (i; i < length; i += 1)
				{
					var currStep = path[i];
					var first = i === 0 ? true : false;
					var xPos = path[i].x * this.cellSize + this.cellSize * 0.5;
					var yPos = path[i].y * this.cellSize + this.cellSize * 0.5;
					if (first) { this._context.moveTo(xPos, yPos); }
					else { this._context.lineTo(xPos, yPos); }
				}
				this._context.stroke();
			}

			/***************** actors ********/

			i = 0;
			var entitiesArray = this._entitiesManager.getArray();
			length = entitiesArray.length;
			for (i; i < length; i += 1)
			{
				var currPlayer = entitiesArray[i];
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
		},
		canvasClickHandler: function (e)
		{
			console.log('click');
			var mouseX = e.clientX - this._canvas.offset().left;
			var mouseY = e.clientY - this._canvas.offset().top;
			var cellSize = this.cellSize;
			//dungeon.createEntity({ type: 'monster', team: 'player', position: { x: Math.floor(mouseX / cellSize), y: Math.floor(mouseY / cellSize) } });
			this.dispatcher.fire('click', { x: Math.floor(mouseX / cellSize), y: Math.floor(mouseY / cellSize) });
		}
		
	};
});