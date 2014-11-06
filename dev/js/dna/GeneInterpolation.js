define(function ()
{
	'use strict';
	
	var GeneInterpolation = function ($geneBank, $confObject)
	{
		this.genes = [];
		if ($confObject !== undefined)
		{
			this.power = $confObject.power;
			this.mutatable = $confObject.mutatable === 'true';
			for (var k = 0, genesLength = $confObject.genes.length; k < genesLength; k += 1)
			{
				this.genes.push($geneBank.getGeneByName($confObject.genes[k]));
			}
		}
	};

	GeneInterpolation.prototype.getGenes = function ()
	{
		return this.genes;
	};

	//static

	GeneInterpolation.createNew = function ($gene1, $gene2)
	{
		var interpolation = new GeneInterpolation();
		interpolation.genes.push($gene1);
		interpolation.genes.push($gene2);
		interpolation.power = 50;
		return interpolation;
	};

	return GeneInterpolation;
});