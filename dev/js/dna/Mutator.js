define(['Utils'], function (Utils)
{
	'use strict';

	return {
		
		init: function ($geneBank, $geneInterpolationBank, $tagsBank)
		{
			this.geneBank = $geneBank;
			this.geneInterpolationBank = $geneInterpolationBank;
			this.tagsBank = $tagsBank;
			this.power = 0;
			this.interpolationFunction = undefined;
			this.usedGenes = undefined;
		},

		getPower : function ()
		{
			return this.power;
		},

		setPower : function ($power)
		{
			this.power = $power;
		},

		mutateRandom : function ($geneSet)
		{
			this.interpolationFunction = function ($genesArray) { return this.geneInterpolationBank.getAvailableInterpolations(this.power, $genesArray, true); };
			this.usedGenes = [];
			this.mutate($geneSet);
		},

		mutateWithGeneSet : function ($geneSet, $toMutateWith)
		{
			this.interpolationFunction = function ($genesArray) { return this.geneInterpolationBank.getInterpolationsForSets(this.power, $genesArray, $toMutateWith); };
			this.usedGenes = [];
			this.mutate($geneSet, $toMutateWith);
		},

		mutate : function ($geneSet, $targetSet)
		{
			var genes = $geneSet.getGenes();
			var targetGenes = $targetSet !== undefined ? $targetSet.getGenes() : undefined;

			var currGene;
			var remainingGenes = [];
			for (var i = 0, genesLength = genes.length; i < genesLength; i += 1)
			{
				currGene = genes[i];
				if (this.usedGenes.indexOf(currGene) === -1)
				{
					remainingGenes.push(currGene);
				}
			}

			var interpolationsArray = this.interpolationFunction.apply(this, [remainingGenes]);

			if (interpolationsArray === undefined)
			{
				return undefined;
			}

			var inter = Utils.getRandom(interpolationsArray);
			interpolationsArray.splice(interpolationsArray.indexOf(inter), 1);

			var refIndex;
			var targetIndex = -1;

			if (inter === undefined)
			{
				return undefined;
			}

			var interGenes = inter.getGenes();

			var interGenesLength = interGenes.length;
			for (i = 0; i < interGenesLength; i += 1)
			{
				currGene = interGenes[i];
				if (remainingGenes.indexOf(currGene) !== -1)
				{
					refIndex = i;
				}
				if (targetGenes !== undefined && targetGenes.indexOf(currGene) !== -1)
				{
					targetIndex = i;
				}
			}

			if (targetIndex === -1)
			{
				if (refIndex === 0)
				{
					targetIndex = refIndex + 1;
				}
				else
				{
					if (refIndex === interGenes.length - 1)
					{
						targetIndex = refIndex - 1;
					}
					else
					{
						targetIndex = Math.random() > 0.5 ? refIndex + 1 : refIndex - 1;
					}
				}
			}

			var newGene = interGenes[targetIndex];
			this.usedGenes.push(newGene);
			//console.log('adding', newGene.name);
			$geneSet.addGene(newGene);

			this.power -= inter.power;

			this.mutate($geneSet, $targetSet);
		}
	};
});