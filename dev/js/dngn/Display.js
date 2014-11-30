define(['ROT'],
	function (ROT) {
	'use strict';

	var Display = {

		init: function ($map)
		{
			this._map = $map;
			this._map.dispatcher.on('cellChange', this.cellChangeHandler.bind(this));
			this._ROTDisplay = new ROT.Display();
			this._cellsToDraw = {};
			document.body.appendChild(this._ROTDisplay.getContainer());
		},
		cellChangeHandler: function ($key)
		{
			this._cellsToDraw[$key] = true;
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
				this._ROTDisplay.draw(x, y, toDraw);
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
				if (currDijk.value === 0)
				{
					this._ROTDisplay.draw(currDijk.x, currDijk.y, 'x', 'white', 'red');
				}
				else
				{
					if (currDijk.value < 10) { this._ROTDisplay.draw(currDijk.x, currDijk.y, currDijk.value, 'white', 'black'); }
					//this._ROTDisplay.draw(currDijk.x, currDijk.y, ' ', 'white', 'hsl(120, 0%, ' + (100 - currDijk.value) + '%)');
				}
			}
			this._ROTDisplay.draw($players[0].posComp.cell.x, $players[0].posComp.cell.y, '@', 'white', 'yellow');
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