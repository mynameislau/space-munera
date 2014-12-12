define([],
	function () {
	'use strict';

	return {
		init: function ($data)
		{
			this.bodyType = $data.bodyType;

			this.sight = 10;
			this.strength = this.bodyType === 'door' ? 10 : 1 + Math.random() * 1;
			
			var vital = {
				init: function ($name)
				{
					this.value = 1;
					this.name = $name;
					return this;
				},
				setValue: function ($value)
				{
					this.value = Math.max(0, Math.min($value, 1));
				},
				increase: function ($multiplier)
				{
					$multiplier = $multiplier || 1;
					this.setValue(this.value + 0.01 * $multiplier);
				},
				decrease: function ($multiplier)
				{
					$multiplier = $multiplier || 1;
					this.setValue(this.value - 0.01 * $multiplier);
				}
			};
			this.food = Object.create(vital).init('food');
			this.water = Object.create(vital).init('water');
			this.health = Object.create(vital).init('health');
			
			return Object.freeze(this);
		}
	};
});