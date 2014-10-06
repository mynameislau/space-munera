define(function ()
{
	'use strict';

	var Gene = function ($params)
	{
		this.type = $params.type;
		this.name = $params.name;
		var modsArray = $params.mods ? $params.mods.split(' ') : [];
		this.mods = {};
		for (var i = 0, modsArrayLength = modsArray.length; i < modsArrayLength; i += 1)
		{
			var currMod = modsArray[i];
			var regExp = /([\.\w]*)([+-=]*.*)/;
			var match = regExp.exec(currMod);

			var modNamesArray = match[1].split('.');
			var currObj = this.mods;
			for (var k = 0, modNamesLength = modNamesArray.length; k < modNamesLength; k += 1)
			{
				//getting example in example.other
				var currModName = modNamesArray[k];
				if (currObj[currModName] === undefined)
				{
					currObj[currModName] = k === modNamesLength - 1 ? match[2] : {};
				}
				currObj = currObj[currModName];
			}
		}

		this.requirements = $params.req ? $params.req.split(',') : [];
		this.typeRequirements = $params.typeReq ? $params.typeReq.split(',') : [];
		this.groups = $params.grp.split(' ');
		//this.typeDependency = $params.typeDep !== undefined ? $params.typeDep.split(',') : [];
		this.geneDependency = $params.geneDep !== undefined ? $params.geneDep.split(',') : [];
		this.description = '';
	};
	return Gene;
});