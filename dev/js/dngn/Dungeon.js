define(['dngn/Map', 'dngn/Display', 'dngn/Engine', 'dngn/Player', 'dngn/SystemsRunner'],
	function (Map, Display, Engine, Player, SystemsRunner) {
	'use strict';

	return {
		init: function ()
		{
			this._map = Object.create(Map);
			this._map.init();

			this._engine = Object.create(Engine);
			this._engine.init();

			this._display = Object.create(Display);
			this._display.init(this._map);
			this._map.generate();

			this.createPlayer();
			this.createPlayer();
			this.createPlayer();
			this.createPlayer();

			this._engine.start();
		},
		createPlayer: function ()
		{
			var redraw = function () {
				this._display.draw(this._map);
			}.bind(this);

			var player = Object.create(Player).init(this._map);
			this._map.placeActor(player);
			player.dispatcher.on('actComplete', redraw);
			player.dispatcher.on('update', function () { this.runSystems(player); }.bind(this));
			this._engine.add(player);
		},
		runSystems: function ($player)
		{
			SystemsRunner.run($player);
		}
	};
});