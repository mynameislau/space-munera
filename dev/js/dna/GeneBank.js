define(['dna/Gene', 'dna/GeneType', 'Utils'], function (Gene, GeneType, Utils)
{
	'use strict';

	var GeneBank = function ($tagsBank, $confObject)
	{
		this.genes = {};
		this.types = {};
		this.tagsBank = $tagsBank;

		for (var typeName in $confObject)
		{
			this.types[typeName] = new GeneType($confObject[typeName]);

			for (var geneName in $confObject[typeName])
			{
				var params = $confObject[typeName][geneName];
				params.type = typeName;
				params.name = geneName;
				var gene = new Gene(params);
				this.genes[geneName] = gene;
				this.types[typeName].genes.push(gene);
			}
		}
	};

	GeneBank.prototype.getGeneByName = function ($name)
	{
		return this.genes[$name];
	};

	GeneBank.prototype.getGenesByType = function ($typeName)
	{
		return this.types[$typeName].genes;
	};

	GeneBank.prototype.getGenesFromTags = function ($tags)
	{
		var returnArray = [];
		for (var name in this.genes)
		{
			var currGene = this.genes[name];

			//console.log(currGene.name, currGene.groups, $tags, this.tagsBank.listContainsSome(currGene.groups, $tags));
			// console.log($tags);
			if (this.tagsBank.listContainsSome(currGene.groups, $tags) === true)
			{
				returnArray.push(currGene);
			}
		}
		return returnArray;
	};

	GeneBank.prototype.getGenesFromTagsAndType = function ($tags, $type)
	{
		var array = this.getGenesFromTags($tags);

		var toReturn = [];

		for (var i = 0, arrayLength = array.length; i < arrayLength; i += 1)
		{
			var currGene = array[i];
			if (currGene.type === $type)
			{
				toReturn.push(currGene);
			}
		}

		return toReturn;
	};

	GeneBank.prototype.getRandomGenesFromTags = function ($tags)
	{
		var array = Utils.shuffle(this.getGenesFromTags($tags));

		var toReturn = [];

		for (var i = 0, arrayLength = array.length; i < arrayLength; i += 1)
		{
			var currGene = array[i];

			for (var k = 0, toReturnLength = toReturn.length; k < toReturnLength; k += 1)
			{
				var currReturnGene = toReturn[k];
				if (currReturnGene.type === currGene.type)
				{
					toReturn.splice(toReturn.indexOf(currReturnGene), 1);
					break;
				}
			}

			toReturn.push(currGene);
		}

		return toReturn;
	};

	return GeneBank;
});