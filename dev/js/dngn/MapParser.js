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
			parsed.entitiesArray = [];

			for (var i = 0, length = $string.length; i < length; i += 1)
			{
				var currChar = $string[i];
				var xPos = i % parsed.width;
				var yPos = Math.floor(i / parsed.width);
				var entity = {};
				entity.position = { x: xPos, y: yPos };

				if (currChar === 'P' || currChar === 'E')
				{
					entity.team = currChar === 'P' ? 'player' : 'enemy';
					entity.type = 'monster';
					parsed.entitiesArray.push(entity);
					currChar = 0;
				}
				else if (currChar === '∏')
				{
					currChar = 0;
					entity.type = 'door';
					entity.team = 'player';
					parsed.entitiesArray.push(entity);
				}
				/*else if (currChar === '∆')
				{
					currChar = 0;
					entity.type = 'server';
					entity.team = 'player';
					parsed.entitiesArray.push(entity);
				}*/
				
				currChar = currChar === ' ' ? 0 : currChar;
				currChar = currChar === '0' ? 1 : currChar;
				parsed.mapArray.push({ x: xPos, y: yPos, terrain: currChar });
			}
			return parsed;
		}
	};
});