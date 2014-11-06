define(['Utils', 'dna/GeneSet'], function (Utils, GeneSet)
{
	'use strict';

	var Creature = function ($geneSet)
	{
		this.geneSet = $geneSet;
	};
	
	Creature.prototype.createFromTags = function ($tags, $geneBank)
	{
		var startArray = $geneBank.getRandomGenesFromTags($tags);
		for (var i = 0, startArrayLength = startArray.length; i < startArrayLength; i += 1)
		{
			var currGene = startArray[i];
			var type = currGene.type;

			while (this.geneSet.addGene(currGene) === false)
			{
				currGene = Utils.getRandom($geneBank.getGenesFromTagsAndType($tags, currGene.type));
			}
		}
	};

	Creature.prototype.createFromObject = function ($confObject, $geneBank)
	{
		this.createFromTags($confObject.base.split(' '), $geneBank);

		if ($confObject.additional)
		{
			for (var i = 0, additionalGenesLength = $confObject.additional.length; i < additionalGenesLength; i += 1)
			{
				var currAddition = $confObject.additional[i];

				if (currAddition[0] === '!')
				{
					var rest = currAddition.slice(1);
					var geneToExclude = $geneBank.getGeneByName(rest);
					while (this.geneSet.getGenes().indexOf(geneToExclude) !== -1)
					{
						this.geneSet.addGene(Utils.getRandom($geneBank.getGenesFromTagsAndType($confObject.base.split(' '), geneToExclude.type)));
					}
				}
				else
				{
					this.geneSet.addGene($geneBank.getGeneByName(currAddition));
				}
			}
		}
		
		//this.debug();
	};

	Creature.prototype.debug = function ()
	{
		for (var i = 0, setLength = this.geneSet.getGenes().length; i < setLength; i += 1)
		{
			var currGene = this.geneSet.getGenes()[i];
			console.log(currGene.type, currGene.name);
		}
	};

	return Creature;
});
