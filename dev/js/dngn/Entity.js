define(['event/Dispatcher', 'dngn/AIComponent', 'dngn/BodyComponent'],
	function (Dispatcher, AIComponent, BodyComponent) {
	'use strict';

	var Entity = {
		init: function ()
		{
			this.dispatcher = Object.create(Dispatcher);

			return this;
		},
		act: function () {
			var promise = new Promise(function (resolve, reject)
			{
				this.dispatcher.fire('update', this);
				
				setTimeout(function () { resolve('ok !'); }, this.type === 'actor' ? 1 : 1);

			}.bind(this));
			promise.then(function ($result) {

			}.bind(this), function ($rejection) {
				console.error($rejection.stack);
			});
			return promise;
		},
		initEntity: function ($data, $map)
		{
			var entity = Object.create(Entity).init();

			if ($data.type === 'monster')
			{
				entity.type = 'actor';
				entity.AIComp = Object.create(AIComponent).init();
				entity.mapComp = $map;
				entity.posComp = { cell: undefined };
				entity.fightingComp = { target: undefined };
				entity.bodyComp = Object.create(BodyComponent).init({ bodyType: 'unit' });
				entity.ordersComp = { team: $data.team, attacking: $data.team === 'player' ? 0.5 : 1, defending: $data.team === 'enemy' ? 0 : 0.5 };
			}
			else if ($data.type === 'door' || $data.type === 'server')
			{
				entity.type = 'static-passive';
				entity.bodyComp = Object.create(BodyComponent).init({ bodyType: 'door' });
				entity.posComp = { cell: undefined };
				entity.ordersComp = { team: $data.team };
			}
			return entity;
		}
	};
	return Entity;
});