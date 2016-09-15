# Synchronize
Class to synchronize functions and ajax requests in javascript

## How to use it

### Exemple (with jquery)
	var s = new Synchronize();
	
	console.log('Start');
	
	var firstId = s.push(function(){
    console.log('Ajax request Start');
	  $.post('/sample.php',
	    {},
	    function (datas) {
	      console.log('Ajax request End');
	      s.notify(firstId);
	    },
	    "json"
	  );
	});
	
	var secondId = s.push(function(){
	  console.log('Second function');
	});
	
	s.start();
	
	console.log('End');

### OUTPUT IN CONSOLE
  - Start
  - Ajax request Start
  - End
  - Ajax request End
  - Second function

### Explanation
  The ajax function and the second function are queued in a buffer. The first function of this buffer is called when you use the "start()" function of the Synchronize Class.

Once the class is notified with its function "notify(ID)", it calls the next function in its buffer. While it doesn't receive this notification, the queued code is stopped

In this exemple, the code execution is :
  - Class declaration
  - first console.log (start)
  - add first function in buffer
  - add second function in buffer
  - start synchronize
  - execute first function (ajax)
  - third console.log (ajax start)
  - second console.log (end)
  - end of ajax request and fourth console.log (ajax end)
  - notify synchronize class
  - execute second function
  - fifth and last console.log
