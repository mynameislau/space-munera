define([],
	function () {
	'use strict';

	return {
		parse: function ($string)
		{
			if (!$string) { return; }
			var parsed = {};
			var lineBreak = /(\r\n|\n|\r)/gm;
			parsed.width = $string.search(lineBreak);
			$string = $string.replace(lineBreak, '');
			parsed.height = $string.length / parsed.width;
			parsed.mapArray = [];
			parsed.actorsArray = [];

			for (var i = 0, length = $string.length; i < length; i += 1)
			{
				var currChar = $string[i];
				var xPos = i % parsed.width;
				var yPos = Math.floor(i / parsed.width);
				var actor = {};
				actor.position = { x: xPos, y: yPos };

				if (currChar === 'P' || currChar === 'E')
				{
					actor.type = currChar === 'P' ? 'player' : 'enemy';
					actor.bodyType = 'unit';
					parsed.actorsArray.push(actor);
					currChar = 0;
				}
				else if (currChar === '∏')
				{
					currChar = 0;
					actor.type = 'door';
					actor.bodyType = 'door';
					parsed.actorsArray.push(actor);
				}
				else if (currChar === '∆')
				{
					currChar = 0;
					actor.type = 'server';
					parsed.actorsArray.push(actor);
				}
				
				currChar = currChar === ' ' ? 0 : currChar;
				currChar = currChar === '0' ? 1 : currChar;
				parsed.mapArray.push({ x: xPos, y: yPos, terrain: currChar });
			}
			return parsed;
		}
	};
});