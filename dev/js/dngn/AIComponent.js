define(['event/Dispatcher'],
	function (Dispatcher) {
	'use strict';

	return {
		init: function ()
		{
			this.dispatcher = Object.create(Dispatcher);
			this._historyArray = [];
			this._historyObject = {};
			this.lastFarest = undefined;
			this.target = undefined;
			this.destination = undefined;
			return this;
		},
		addHistoryItem: function ($item)
		{
			if (this._historyObject[$item.key]) { return false; }
			this._historyObject[$item.key] = $item;
			this._historyArray.push($item);
			return true;
		},
		getHistoryItem: function ($key)
		{
			return this._historyObject[$key];
		},
		getHistory: function ()
		{
			return this._historyArray;
		},
		setState: function ($state)
		{
			this._state = $state;
			this.dispatcher.fire('stateChanged');
		},
		getStateName: function ()
		{
			return this._state.name;
		}
	};
});