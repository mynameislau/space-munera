define(['dngn/Map', 'dngn/Display', 'dngn/Engine', 'dngn/Player', 'dngn/SystemsRunner'],
	function (Map, Display, Engine, Player, SystemsRunner) {
	'use strict';

	return {
		init: function ($mapString)
		{
			this._map = Object.create(Map);
			this._map.init();

			this._engine = Object.create(Engine);
			this._engine.init();

			this._display = Object.create(Display);
			this._display.init(this._map);
			this._map.generate($mapString);

			this._players = [];

			this.createPlayer();

			this._engine.start();
		},
		createPlayer: function ()
		{
			var player = Object.create(Player).init(this._map);
			this._map.placeActor(player);
			this._players.push(player);
			player.dispatcher.on('update', function () { this.runSystems(player); }.bind(this));
			this._engine.add(player);
		},
		runSystems: function ($player)
		{
			SystemsRunner.run($player);
			this._display.draw(this._map, this._players);
		}
	};
});