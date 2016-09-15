class Logger
{
	constructor (id)
	{
		this.div = document.createElement('div');
		this.div.id = id;
		this.div.className = 'test';
		document.body.appendChild(this.div);
		
		var testTitle = document.createElement('h2');
		testTitle.innerHTML = 'Test ' + id;
		
		this.div.appendChild(testTitle);
		
		Logger.countTest++;
		
		if (Logger.countTest % 2 === 0)
		{
			var separator = document.createElement('div');
			separator.className = 'pushFloat';
			document.body.appendChild(separator);
		}
		
		return this;
	}
	
	info (text)
	{
		var info = document.createElement('div');
		info.className = 'info';
		info.innerHTML = text;

		this.div.appendChild(info);
	}
	
	log (text)
	{
		var log = document.createElement('div'),
			date = new Date();
		log.innerHTML = '<span>'
				+ date.getHours() + ':'
				+ date.getMinutes() + ':'
				+ date.getSeconds() + '.'
				+ ("" + (date.getMilliseconds()/1000)).substring(2)
			+ '</span>'
			+ text;

		this.div.appendChild(log);
	}
};

Logger.countTest = 0;

var min = 100,
	max = 500,
	tests = {
		'random':function(logger)
		{
			logger.info('This test logs at different and random timings');
			var s = new Synchronize();
		
			s.waitNotification = false;
			
			var firstFunction = s.push(function(){
				window.setTimeout(function(){
					logger.log("First timeout");
					s.notify(firstFunction);
				}, Math.floor(Math.random() * (max - min)) + min);
			});
			
			var secondFunction = s.push(function(){
				window.setTimeout(function(){
					logger.log("Second timeout");
					s.notify(secondFunction);
				}, Math.floor(Math.random() * (max - min)) + min);
			});
			
			var thirdFunction = s.push(function(){
				window.setTimeout(function(){
					logger.log("Third timeout");
					s.notify(thirdFunction);
				}, Math.floor(Math.random() * (max - min)) + min);
			});
		},
		'synchronise':function(logger)
		{
			logger.info('This test logs at different and random timings but with Synchronise functions activated');
			var s = new Synchronize();
		
			s.autostart = false;
			
			var firstFunction = s.push(function(){
				window.setTimeout(function(){
					logger.log("First timeout");
					s.notify(firstFunction);
				}, Math.floor(Math.random() * (max - min)) + min);
			});
			
			var secondFunction = s.push(function(){
				window.setTimeout(function(){
					logger.log("Second timeout");
					s.notify(secondFunction);
				}, Math.floor(Math.random() * (max - min)) + min);
			});
			
			var thirdFunction = s.push(function(){
				window.setTimeout(function(){
					logger.log("Third timeout");
					s.notify(thirdFunction);
				}, Math.floor(Math.random() * (max - min)) + min);
			});
			
			s.start();
		},
		'conditional':function(logger)
		{
			logger.info('The second test should always be done after the first and second');
			var s = new Synchronize();
			
			var firstFunction = s.push(function(){
				window.setTimeout(function(){
					logger.log("First timeout");
					s.notify(firstFunction);
				}, Math.floor(Math.random() * (max - min)) + min);
			});
			
			var thirdFunction = s.push(function(){
				window.setTimeout(function(){
					logger.log("Third timeout");
					s.notify(thirdFunction);
				}, Math.floor(Math.random() * (max - min)) + min);
			});
			
			var secondFunction = s.when([firstFunction, thirdFunction], function(){
				window.setTimeout(function(){
					logger.log("Second timeout");
					s.notify(secondFunction);
				}, Math.floor(Math.random() * (max - min)) + min);
			});
			
			var fourthFunction = s.push(function(){
				window.setTimeout(function(){
					logger.log("Fourth timeout");
					s.notify(fourthFunction);
				}, Math.floor(Math.random() * (max - min)) + min);
			});
			
			s.start();
		}
	};

$(document).ready(function(){
	
	for(var test in tests)
	{
		if (typeof tests[test] === "function")
		{
			tests[test](new Logger(test));
		}
	};
	
});