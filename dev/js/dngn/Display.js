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
		draw: function ($map)
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
			//debugger;

			/*var actorCells = $map.getActorCells();
			for (var i = 0, actorsLength = actorCells.length; i < actorsLength; i += 1)
			{
				var currActorCell = actorCells[i];

				var visiData = $map.getVisibilityData(currActorCell.getKey());
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
					this._ROTDisplay.draw(currFarest.getX(), currFarest.getY(), 'x', '#fff', '#ff0000');
				}
			}*/
		}
		
	};

	return Display;

});