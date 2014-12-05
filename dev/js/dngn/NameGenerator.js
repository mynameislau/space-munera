define(['ROT'],
	function (ROT) {
	'use strict';

	return {
		init: function ($names)
		{
			this.generator = new ROT.StringGenerator();
			var names = $names.split('\n');
			for (var i = 0, length = names.length; i < length; i += 1)
			{
				var currName = names[i];
				this.generator.observe(currName);
			}

			return this;
		},
		generate: function ()
		{
			return this.generator.generate();
		}
	};
});