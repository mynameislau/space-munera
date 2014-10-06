requirejs.config({
	
	waitSeconds: 30,

	paths: {
		'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
		'Utils': 'libs/Utils'
	},
	shim: {
		'jquery': {
			exports: 'jquery'
		}
	}
});

require(['jquery',
	'libs/lite_loader',
	'dna/Creature',
	'dna/Gene',
	'dna/GeneBank',
	'dna/TagsBank',
	'dna/GeneInterpolationBank',
	'dna/Mutator',
	'dna/GeneSet'],
	function (jquery, LiteLoader, Creature, Gene, GeneBank, TagsBank, GeneInterpolationBank, Mutator, GeneSet)
	{
		$(document).ready(function ()
		{
			console.log('document ready');

			var loaderCompleteHandler = function ()
			{
				console.log('loader complete');
				var tagsBank = new TagsBank(loader.getContent('tags'));
				var geneBank = new GeneBank(tagsBank, loader.getContent('genes'));
				var geneInterpolationBank = new GeneInterpolationBank(geneBank, loader.getContent('interpolations'));

				var mirmignon = new Creature(new GeneSet(tagsBank, geneBank));
				mirmignon.createFromObject(loader.getContent('creatures').totor, geneBank);

				console.log(mirmignon.geneSet.getModifiers());
				
				var mutator = Object.create(Mutator);
				mutator.init(geneBank, geneInterpolationBank, tagsBank);
				mutator.setPower(99999);

				$('#js-mutation').on('click', function ()
				{
					mutator.mutateRandom(mirmignon.geneSet);
					console.log(mirmignon.geneSet.getModifiers());
				});
			};
			var loaderErrorHandler = function ()
			{
				console.log('error');
			};

			var loader = new LiteLoader({ completeHandler : loaderCompleteHandler, errorHandler: loaderErrorHandler });
			console.log(loader);
			loader.appendJSONLoader({ name : 'tags', URL : 'data/tags.json' });
			loader.appendJSONLoader({ name : 'genes', URL : 'data/genes.json' });
			loader.appendJSONLoader({ name : 'interpolations', URL : 'data/interpolations.json' });
			loader.appendJSONLoader({ name : 'creatures', URL : 'data/creatures.json' });
			loader.load();
		});
});