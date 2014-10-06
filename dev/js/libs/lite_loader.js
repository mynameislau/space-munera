define(function (require)
{
	var $ = require('jquery');

	var LiteLoader = function ($params)
	{
		this.loadersArray = [];
		this.index = 0;
		this.name = $params.name;
		this.URL = $params.URL;
		this.progressHandler = $params.progressHandler;
		this.completeHandler = $params.completeHandler;
		this.errorHandler = $params.errorHandler;
	};

	LiteLoader.prototype.appendJSONLoader = function ($params)
	{
		var loader = new LiteLoader($params);
		this.loadersArray.push(loader);
		var mainLoader = this;
		loader.load = function() 
		{
			console.log('loading', $params.URL);
			$.ajax({
				dataType: "json",
				url: $params.URL,
				success: function ($data)
				{
					console.log('success');
					mainLoader.loaderCompleteHandler($data);
				},
				error: this.errorHandler
			});
		};
	};

	LiteLoader.prototype.appendXMLLoader = function ($params)
	{
		var loader = new LiteLoader($params);
		this.loadersArray.push(loader);
		var mainLoader = this;
		loader.load = function() 
		{
			$.get($params.URL, function ($data) 
			{
				mainLoader.loaderCompleteHandler($data);
			});
		};
	};

	LiteLoader.prototype.load = function ()
	{
		if(this.index < this.loadersArray.length)
		{
			this.loadersArray[this.index].load();
		}
		else
		{
			this.completeHandler();
		}
	};

	LiteLoader.prototype.getContent = function($name)
	{
		for (var i = 0, loadersLength = this.loadersArray.length; i < loadersLength; i += 1)
		{
			var currLoader = this.loadersArray[i];
			if(currLoader.name === $name)
			{
				return currLoader.data;
			}
		}
	};

	LiteLoader.prototype.loaderCompleteHandler = function ($data)
	{
		this.loadersArray[this.index].data = $data;
		this.index += 1;
		this.load();
	};

	return LiteLoader;
});