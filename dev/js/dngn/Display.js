define(['ROT'],
	function (ROT) {
	'use strict';

	var Display = {

		init: function ()
		{
			this.ROTdisplay = new ROT.Display();
			document.body.appendChild(this.ROTdisplay.getContainer());
		},
		draw: function ($map)
		{
			var cells = $map.getCells();
			
			for (var key in cells)
			{
				var parts = key.split(',');
				var x = parseInt(parts[0]);
				var y = parseInt(parts[1]);

				var toDraw = 0;
				switch (cells[key].getTerrain())
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
						toDraw = cells[key].getTerrain();
						break;
				}
				this.ROTdisplay.draw(x, y, toDraw);
			}

			var actorCells = $map.getActorCells();
			var visiData = $map.getVisibilityData(actorCells[0].getKey());
			for (key in visiData.visibleCells)
			{
				var currCell = visiData.visibleCells[key];
				var ch = (currCell.r ? '' : '@');
				var color = $map.getCells()[key].lightPasses() ? '#aa0': '#660';
				this.ROTdisplay.draw(currCell.x, currCell.y, ch, '#fff', color);
			}
			for (var i = 0, farestLength = visiData.farestWalkables.length; i < farestLength; i += 1)
			{
				var currFarest = visiData.farestWalkables[i];
				this.ROTdisplay.draw(currFarest.getX(), currFarest.getY(), 'x', '#fff', '#ff0000');
			}
		}
		
	};

	return Display;

});