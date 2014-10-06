define(['Utils'], function (Utils)
{
	'use strict';

	var GeneSet = function ($tagsBank, $geneBank)
	{
		this.tagsBank = $tagsBank;
		this.geneBank = $geneBank;
		this.genesArray = [];
	};

	GeneSet.prototype.getGeneByName = function ($name)
	{
		for (var i = 0, genesArrayLength = this.genesArray.length; i < genesArrayLength; i += 1)
		{
			var currGene = this.genesArray[i];
			if (currGene.name === $name)
			{
				return currGene;
			}
		}
	};

	GeneSet.prototype.getGenes = function ()
	{
		return this.genesArray;
	};

	GeneSet.prototype.getGeneByType = function ($type)
	{
		for (var i = 0, genesArrayLength = this.genesArray.length; i < genesArrayLength; i += 1)
		{
			var currGene = this.genesArray[i];
			if (currGene.type === $type)
			{
				return currGene;
			}
		}
	};

	GeneSet.prototype.cleanUp = function ()
	{
		for (var i = 0, genesArrayLength = this.genesArray.length; i < genesArrayLength; i += 1)
		{
			var currGene = this.genesArray[i];
			
			/*
			
			TO REDO

			for (var k = 0, geneDependencyLength = currGene.geneDependency.length; k < geneDependencyLength; k += 1)
			{
				var currDependency = currGene.geneDependency[k];
				if (this.getGeneByName(currDependency) === undefined)
				{
					//console.log('cleaning', currGene.name);
					this.genesArray.splice(i, 1);

					i -= 1;
					genesArrayLength = this.genesArray.length;
				}
			}*/
		}
	};

	GeneSet.prototype.addGenes = function ($genes)
	{
		for (var i = 0, genesLength = $genes.length; i < genesLength; i += 1)
		{
			this.addGene($genes[i]);
		}
	};

	GeneSet.prototype.addGene = function ($gene)
	{
		if (this.genesArray.indexOf($gene) !== -1)
		{
			return true;
		}

		for (var i = 0, genesArrayLength = this.genesArray.length; i < genesArrayLength; i += 1)
		{
			var currGene = this.genesArray[i];
			if (currGene.type === $gene.type)
			{
				this.genesArray.splice(i, 1);
				break;
			}
		}

		var geneDepLength = $gene.geneDependency.length;
		if (geneDepLength > 0)
		{
			for (i = 0; i < geneDepLength; i += 1)
			{
				var depGeneName = $gene.geneDependency[i];
				var depGene = this.geneBank.getGeneByName(depGeneName);

				if (this.getGeneByType(depGene.type) === undefined)
				{
					this.addGene(depGene);
				}
			}
		}

		//console.log('adding', $gene.name);
		this.genesArray.push($gene);

		var reqLength = $gene.requirements.length;
		for (i = 0; i < reqLength; i += 1)
		{
			var currReq = this.geneBank.getGeneByName($gene.requirements[i]);
			this.addGene(currReq);
		}

		this.cleanUp();

		return this.genesArray.indexOf($gene) !== -1;
	};

	GeneSet.prototype.getModifiers = function ()
	{
		var modifiers = {};
		var recur = function ($currObj, $currModifierObj)
		{
			for (var name in $currObj)
			{
				if (typeof $currObj[name] !== 'string')
				{
					if (!$currModifierObj[name])
					{
						$currModifierObj[name] = {};
					}
					recur($currObj[name], $currModifierObj[name]);
				}
				else
				{
					//if it is an arithmetic modification
					if (/[+-]?\d*\.*\d*/.test($currObj[name]))
					{
						//if the modifier doesn't exist or is something else
						if (window.isNaN($currModifierObj[name]))
						{
							//initialize it
							$currModifierObj[name] = 0;
						}
						//and alter it
						$currModifierObj[name] += Number($currObj[name]);
					}
					else
					{
						$currModifierObj[name] = $currObj[name];
					}
				}
			}
		};
		
		for (var i = 0, genesLength = this.genesArray.length; i < genesLength; i += 1)
		{
			var currGene = this.genesArray[i];
			//adding gene to modifiers
			modifiers[currGene.name] = currGene;
			//adding extra modifiers
			recur(currGene.mods, modifiers);
		}

		return modifiers;
	};

	GeneSet.prototype.copy = function ()
	{
		var geneSet = new GeneSet(this.tagsBank, this.geneBank);
		geneSet.addGenes(this.genesArray);
		return geneSet;
	};

	return GeneSet;
});