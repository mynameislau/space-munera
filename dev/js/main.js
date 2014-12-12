requirejs.config({
	
	waitSeconds: 30,

	paths: {
		'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
		'Utils': 'libs/Utils',
		'ROT': 'libs/rot.js/rot'
	},
	shim: {
		'ROT': {
			exports: 'ROT'
		},
		'jquery': {
			exports: 'jquery'
		}
	}
});

require(['jquery',
	'libs/lite_loader',
	'dngn/Dungeon',
	'dna/Creature',
	'dna/Gene',
	'dna/GeneBank',
	'dna/TagsBank',
	'dna/GeneInterpolationBank',
	'dna/Mutator',
	'dna/GeneSet'],
	function (jquery, LiteLoader, Dungeon, Creature, Gene, GeneBank, TagsBank, GeneInterpolationBank, Mutator, GeneSet)
	{
		$(document).ready(function ()
		{

			var loaderCompleteHandler = function ()
			{
				console.log('loader complete');
				
				var dungeon = Object.create(Dungeon);
				dungeon.init(loader.getContent('map'), loader.getContent('names'));

				$('#js-minion').click(function ()
				{
					dungeon.createEntity({ type: 'monster', team: 'player' });
				});
				dungeon.createEntity({ type: 'monster', team: 'player' });
				
				var canvas = $('#canvas');
				$('#canvas').click(function (e)
				{
					var mouseX = e.clientX - canvas.offset().left;
					var mouseY = e.clientY - canvas.offset().top;
					var cellSize = dungeon.display.cellSize;
					console.log(Math.floor(mouseX / cellSize), Math.floor(mouseY / cellSize));
					dungeon.createEntity({ type: 'monster', team: 'player', position: { x: Math.floor(mouseX / cellSize), y: Math.floor(mouseY / cellSize) } });
				});

				//MUTANT
				/*var tagsBank = new TagsBank(loader.getContent('tags'));
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
				});*/
				//
			};
			var loaderErrorHandler = function ()
			{
				console.log('error');
			};

			var loader = new LiteLoader({ completeHandler : loaderCompleteHandler, errorHandler: loaderErrorHandler });
			loader.appendJSONLoader({ name : 'tags', URL : 'data/tags.json' });
			loader.appendJSONLoader({ name : 'genes', URL : 'data/genes.json' });
			loader.appendJSONLoader({ name : 'interpolations', URL : 'data/interpolations.json' });
			loader.appendJSONLoader({ name : 'creatures', URL : 'data/creatures.json' });
			loader.appendStringLoader({ name : 'map', URL : 'data/map3.dmap' });
			loader.appendStringLoader({ name : 'names', URL : 'data/insultes.txt' });
			loader.load();
		});
	});