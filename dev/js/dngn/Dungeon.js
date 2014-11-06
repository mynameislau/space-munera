define(['dngn/Map', 'dngn/Display', 'dngn/Engine', 'dngn/Player'],
	function (Map, Display, Engine, Player) {
	'use strict';

	return {
		init: function ()
		{
			this.map = Object.create(Map);
			this.map.generate();

			this.engine = Object.create(Engine);
			
			this.player = Object.create(Player);
			this.player.init(this.engine, this.map);
			this.map.placePlayer(this.player);

			this.engine.start(this.player);

			var display = Object.create(Display);
			display.init();
			
			var redraw = function () {
				display.draw(this.map);
			}.bind(this);

			this.player.actCallback = redraw;
		}
	};
});