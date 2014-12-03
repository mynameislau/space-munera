define(['dngn/Map', 'dngn/Display', 'dngn/Engine', 'dngn/Player', 'dngn/SystemsRunner', 'dngn/Debug'],
	function (Map, Display, Engine, Player, SystemsRunner, Debug) {
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

			Object.create(Debug).init();

			this._players = [];

			this.createPlayer().prenom = 'toto';
			//this.createPlayer().prenom = 'victor';

			this._engine.start();
		},
		createPlayer: function ()
		{
			var player = Object.create(Player).init(this._map);
			this._map.placeActor(player);
			this._players.push(player);
			player.dispatcher.on('update', this.runSystems.bind(this));
			player.dispatcher.on('deletion', this.removePlayer.bind(this));
			this._engine.add(player);
			return player;
		},
		removePlayer: function ($player)
		{
			this._engine.remove($player);
			this._players.splice(this._players.indexOf($player), 1);
			this._map.removeActorFromCell($player);
		},
		runSystems: function ($entity)
		{
			SystemsRunner.run($entity);
			this._display.draw(this._map, this._players);
		}
	};
});