define(['dna/GeneInterpolation'], function (GeneInterpolation)
{
	'use strict';

	var GeneInterpolationBank = function ($geneBank, $interpolationsObject)
	{
		this.interpolationsArray = [];
		this.geneBank = $geneBank;

		for (var i = 0, objectLength = $interpolationsObject.length; i < objectLength; i += 1)
		{
			var currObject = $interpolationsObject[i];
			var currInter = new GeneInterpolation($geneBank, currObject);
			this.interpolationsArray.push(currInter);
		}
	};

	GeneInterpolationBank.prototype.getAvailableInterpolations = function ($power, $genesArray, $mutatable)
	{
		var toReturn = [];
		for (var i = 0, interpolationsLength = this.interpolationsArray.length; i < interpolationsLength; i += 1)
		{
			var currInter = this.interpolationsArray[i];
			if ($mutatable === true && currInter.mutatable === false)
			{
				continue;
			}
			if (currInter.power <= $power)
			{
				for (var k = 0, genesLength = $genesArray.length; k < genesLength; k += 1)
				{
					var currGene = $genesArray[k];
					if (currInter.getGenes().indexOf(currGene) !== -1)
					{
						toReturn.push(currInter);
					}
				}
			}
		}

		return toReturn;
	};

	GeneInterpolationBank.prototype.getInterpolationsForSets = function ($power, $genesArray, $targetGeneSet)
	{
		//console.log($targetGeneSet);
		var toReturn = [];
		var toAdd;
		for (var i = 0, firstSetLength = $genesArray.length; i < firstSetLength; i += 1)
		{
			var currGene = $genesArray[i];
			var otherGene = $targetGeneSet.getGeneByType(currGene.type);

			if (otherGene === undefined || otherGene === currGene)
			{
				continue;
			}

			var inters = this.getInterpolationsByGene(currGene);
			toAdd = undefined;
			for (var k = 0, interpolationsLength = inters.length; k < interpolationsLength; k += 1)
			{
				var currInter = inters[k];
				if (currInter.getGenes().indexOf(otherGene) !== -1)
				{
					toAdd = currInter;
				}
			}

			if (toAdd === undefined)
			{
				toAdd = GeneInterpolation.createNew(currGene, otherGene);
			}

			toReturn.push(toAdd);
		}

		/*var set1Interpolations = this.getAvailableInterpolations($power, $geneSet1);

		for (var i = 0, interpolationsLength = set1Interpolations.length; i < interpolationsLength; i += 1)
		{
			var currInter = set1Interpolations[i];
			for (var k = 0, genesLength = $geneSet2.length; k < genesLength; k += 1)
			{
				var currGene = $geneSet2[k];
				if (currInter.getGenes().indexOf(currGene) !== -1)
				{
					toReturn.push(currInter);
				}
			}
		}*/

		return toReturn;
	};

	GeneInterpolationBank.prototype.getInterpolationsByGene = function ($gene)
	{
		var toReturn = [];
		
		for (var i = 0, interpolationsLength = this.interpolationsArray.length; i < interpolationsLength; i += 1)
		{
			var currInter = this.interpolationsArray[i];
			if (currInter.getGenes().indexOf($gene) !== -1)
			{
				toReturn.push(currInter);
			}
		}

		return toReturn;
	};

	return GeneInterpolationBank;
});