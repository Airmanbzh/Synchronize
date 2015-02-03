/**
 * @author LE BOULC'H Brice
 * @class Synchronise
 * @description Synchronise functions to execute one after the others
 */
Synchronize = function() {
    /**
     * List of currents functions to synchronise
     * @type {Array}
     */
    this.functions = [];

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
    this.wait_notification = false;

    /**
     * Add a function to the queue
     * @param function f    function to execute
     * @param array args    arguments
     * @return {Number}     identification number
     */
    this.push = function(f, args) {
        this.lastId = this.lastId + 1 || new Date().getTime();
        this.functions.push({id: this.lastId, _function:f, _args:args,state:0, value:undefined});
        if (this.autostart) {this.start();}
        return this.lastId;
    };

    /**
     * @description Notify that the current function is finished and start the next one
     * @param (optionnal)id ID of the function to notify as stopped/finished
     */
    this.notify = function(id) {
        var find = false;
        for (var i= 0, ln = this.functions.length, find = false; i < ln && find == false; i++) {
        	if ((this.functions[i]._function == this.notify.caller && this.functions[i].state == 1)
            || this.functions[i].id == id) {
                this.functions[i].state = -1;
                find = true;
            }
        }
        if (find && (this.autostart || this.wait_notification)) {this.start();}
        return find;
    };

    /**
     * @description Start the execution
     */
    this.start = function() {
        for (var i= 0, ln = this.functions.length, find = false; i < ln && find == false; i++) {
            if (this.functions[i].state == 0) {
                this.functions[i].state = 1;
                this.functions[i].value = this.functions[i]._function(this.functions[i]._args);
                find = true;
            } else if (this.functions[i].state == 1) {
                find = true;
            }
        }
        if (!this.wait_notification) {this.notify();}
    };

    /**
     * @description Stop the execution
     */
    this.stop = function() {
        this.autostart=false;
    };

    /**
     * @description Reverse functions order
     */
    this.reverse = function() {
    	this.functions.reverse();
    };
};
