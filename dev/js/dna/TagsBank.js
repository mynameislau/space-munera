define(function ()
{
	'use strict';
	
	var TagsBank = function ($confObject)
	{
		this.tags = $confObject;
	};

	TagsBank.prototype.tagContainsTag = function ($containing, $contained)
	{
		var found = false;
		var contained = $contained;
		var containing = $containing;
		var isNegative = $containing[0] === '!';
		if ($contained[0] === '!')
		{
			isNegative = true;
			contained = $contained.slice(1);
		}
		if ($containing[0] === '!')
		{
			isNegative = true;
			containing = $containing.slice(1);
		}

		if (containing === contained)
		{
			found = true;
		}
		else
		{
			var tags = this.tags;

			var recur = function ($currContained)
			{
				var inArray = tags[$currContained].in ? tags[$currContained].in.split(' ') : [];
				for (var i = 0, inLength = inArray.length; i < inLength; i += 1)
				{
					var currIn = inArray[i];
					if (currIn === containing)
					{
						found = true;
					}
					else
					{
						recur(currIn);
					}
				}
			};
			recur(contained);
		}

		var isOK = (found === true && isNegative === false) || (found === false && isNegative === true);
		//console.log($containing, $contained, found, isNegative, 'isOK', isOK);

		return isOK;
	};

	TagsBank.prototype.listContainsTag = function ($listToSearch, $tag)
	{
		var toSearch = $listToSearch;
		for (var i = 0, toSearchLength = toSearch.length; i < toSearchLength; i += 1)
		{
			var currSearch = toSearch[i];
			var contains = this.tagContainsTag(currSearch, $tag);
			//console.log('currSearch', currSearch, 'tag', $tag, contains);
			if (contains === true)
			{
				return true;
			}
		}
		return false;
	};

	TagsBank.prototype.listContainsSome = function ($listToSearch, $listToFind)
	{
		for (var i = 0, toFindLength = $listToFind.length; i < toFindLength; i += 1)
		{
			var currTag = $listToFind[i];
			//console.log('currTagToLookFor', currTag, toFindLength);
			if (this.listContainsTag($listToSearch, currTag) === true)
			{
				return true;
			}
		}
		return false;
	};

	return TagsBank;
});