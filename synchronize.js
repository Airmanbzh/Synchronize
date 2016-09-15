/**
 * @author LE BOULC'H Brice
 * @class Synchronize
 * @description synchronize functions to execute one after the others
 */
Synchronize = function ()
{
	/**
	 * List of currents functions to synchronize
	 * @type {Array}
	 */
	this.functions = [];

	/**
	 * List of currents functions which wait other to finish
	 * @type {Array}
	 */
	this.conditionalFunctions = [];

	/**
	 * Start automatically (or not) when you push a new function
	 * @type {Boolean}
	 */
	this.autostart = true;

	/**
	 * Id of the last function inserted
	 * @type {Number}
	 */
	this.lastId = 0;

	/**
	 * Wait (or not) notification from current execution before execute next function
	 * @type {Boolean}
	 */
	this.waitNotification = true;

	/**
	 * Add a function to the queue
	 * @param function f    function to execute
	 * @return {Number}     identification number
	 */
	this.push = function (f)
	{
		addFunction(
			{
				_function: f,
				_args:Array.from(arguments).slice(1)
			}
		);

		if (this.autostart)
		{
			startFunction(this.functions.length - 1);
		}
		
		return this.lastId;
	};

	/**
	 * Add a function to the queue with conditional parameters
	 * @param {Array} Array of IDs to wait
	 * @param function f    function to execute
	 * @return {Number}     identification number
	 */
	this.when = function (wait, f)
	{	
		addFunction(
			{
				wait:wait,
				_function: f,
				_args:Array.from(arguments).slice(2)
			}
		);
	};
	
	var addFunction = function(f)
	{
		this.lastId = this.lastId + 1 || new Date().getTime();
		
		f.id = this.lastId;
		f.state = 0;
		f.value = undefined;
		f.wait = f.wait || [];
		
		this.functions.push(f);
		
		return this.lastId;
	}.bind(this);

	/**
	 * @description Notify that the current function is finished and start the next one
	 * @param (optionnal)id ID of the function to notify as stopped/finished
	 */
	this.notify = function (id)
	{
		var find = false;
		for (var i = 0, ln = this.functions.length, find = false; i < ln && find === false; i++)
		{
			if ((this.functions[i]._function === this.notify.caller && this.functions[i].state === 1)
					|| this.functions[i].id === id)
			{
				this.functions[i].state = -1;
				find = true;
			}
		}
		
		if (find && (this.autostart || this.waitNotification))
		{
			this.start();
		}
		return find;
	};

	/**
	 * @description Start the execution
	 */
	this.start = function ()
	{
		for (var i = 0, ln = this.functions.length, find = false; i < ln && find === false; i++)
		{
			if (this.functions[i].state === 0)
			{
				find = !this.functions[i].wait.length;
				if (!find)
				{
					var ready = true;
					this.functions[i].wait.forEach(function(v,k){
						ready &= this.functions[v - 1].state === -1;
					}.bind(this));
					
					find = ready;
				}
				
				if (find)
				{
					startFunction(i);
				}
			}
			else if (this.functions[i].state === 1)
			{
				find = true;
			}
		}
		
		if (!this.waitNotification)
		{
			this.notify();
		}
	};
	
	var startFunction = function(i)
	{
		this.functions[i].state = 1;
		this.functions[i].value = this.functions[i]._function(this.functions[i]._args);
	}.bind(this);

	/**
	 * @description Stop the execution
	 */
	this.stop = function ()
	{
		this.autostart = false;
	};

	/**
	 * @description Reverse functions order
	 */
	this.reverse = function ()
	{
		this.functions.reverse();
	};
};
