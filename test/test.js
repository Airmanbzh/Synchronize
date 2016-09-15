var test = require('unit.js');
require('../synchronize');

describe('Basic methods', function(){
	
	it('constructor return an object', function(){
		var s = new Synchronize();
		test.object(s);
	});

	it('push return an id', function(){
		var s = new Synchronize();
		var id = s.push(function(){return 1;});
		
		test.number(id);
	});

	it('start', function(){
		var s = new Synchronize();
		var spy  = test.spy();
		
		
		var id = s.push(function(){
			spy();
		});
		
		s.start();
		
		test.bool(spy.calledOnce).isTrue();
	});

	it('stop', function(){
		var s = new Synchronize();
		var spy  = test.spy();
		
		
		var id = s.push(function(){
			spy();
			s.stop();
		});
		
		var id2 = s.push(function(){
			spy();
		});
		
		s.start();
		
		test.bool(spy.calledOnce).isTrue();
	});
});

describe('Advance methods', function(){
	it('random', function(){
	});
	
	it('synchronise', function(){
	});

	it('conditional', function(){
	});
});