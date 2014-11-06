define(function ()
{
	'use strict';
	
	return {

		shuffle : function ($array)
		{
			var currentIndex = $array.length;
			var temporaryValue;
			var randomIndex;

			// While there remain elements to shuffle...
			while (0 !== currentIndex)
			{
				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;

				// And swap it with the current element.
				temporaryValue = $array[currentIndex];
				$array[currentIndex] = $array[randomIndex];
				$array[randomIndex] = temporaryValue;
			}

			return $array;
		},

		getRandom : function ($array)
		{
			return $array[Math.floor(Math.random() * $array.length)];
		},

		startsWith : function ($excerpt, $string)
		{
			if ($excerpt.length === 0)
			{
				return false;
			}

			var exLength = $excerpt.length;

			if ($string.slice(0, exLength) === $excerpt)
			{
				return true;
			}

			return false;
		}
	};
});