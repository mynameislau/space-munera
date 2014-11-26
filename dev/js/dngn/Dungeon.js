define(['dngn/Map', 'dngn/Display', 'dngn/Engine', 'dngn/Player', 'dngn/MainController'],
	function (Map, Display, Engine, Player, MainController) {
	'use strict';

	return {
		init: function ()
		{
			this._map = Object.create(Map);
			this._map.init();

			this._engine = Object.create(Engine);
			this._engine.init();

			this._controller = Object.create(MainController);
			this._controller.init();

			this._display = Object.create(Display);
			this._display.init(this._map);
			this._map.generate();

			this.createPlayer();

			this._engine.start();
		},
		createPlayer: function ()
		{
			var redraw = function () {
				this._display.draw(this._map);
			}.bind(this);

			var player = Object.create(Player);
			player.init(this._controller, this._map);
			player.dispatcher.on('actComplete', redraw);
			this._engine.add(player);
		}
	};
});