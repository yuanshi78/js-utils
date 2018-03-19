/**
 * Class factory
 * Aliaksandr Kuzmiankou 元实
 * 2016-10-18
 */

/**
 * Examples
 * --------
 * 1. Create a class
 * var Person = new Class();
 *
 * 2. Create a class which inherits from another class
 * var Person = new Class();
 * var Woman = new Class(Person);
 *
 * 3. Create a class with an initializing function
 * var Person = new Class(function(){this.type = "person";});
 *
 * 4. Create a class with an initializing function which inherits from another class
 * var Person = new Class();
 * var Woman = new Class(Person，function(){this.sex = "woman"});
 *
 * 5. Add static properties and methods to the class
 * var Person = new Class();
 * Person.extend({calculateAge: function(){...}});
 *
 * 6. Add properties and methods that will be available in all instances of the class
 * var Person = new Class();
 * Person.include({calculateAge: function(){...}});
 *
 * 7. Bind a function to a context
 * function onClick (){
 *    alert ("Ok");
 * }
 *
 * var  this_obj = document.getElementById("this_div");
 * var self = this;
 * this_obj.addEventListener("click", function(){var clickIt = Class.proxy(onClick, self);
 *                                                clickIt();});
 *
 *
 * 8. Bind a function to an object of a class, created with this class factory
 * function displaySex (){
 *    alert (this.sex);
 * }
 *
 * var Person = new Class();
 * var Woman = new Class(Person, function{this.sex = "woman"});
 * var my_wife = new Woman();
 *
 * var displaySex_1 =  my_wife.proxy(displaySex);
 * displaySex_1(); 
 */

/**
 * Class factory
 * @param {Object} [parent_class] - parent class
 * @param {function} [init_function] - init function
 * @constructor
 */

(function(exports){
	exports.Class = function(){
		var args_qnty = arguments.length;
		var parent_class = null;
		var init_function = null;

		/* If the constructor receives two arguments, the first one is a parent class and 
		   the second one is an init function */ 
		if (args_qnty == 2){
			parent_class = arguments[0];
			init_function = arguments[1];		
		} else if (args_qnty == 1){ // If there's ony one argument, it's either a parent class or an init function
			if (!(arguments[0] instanceof Class)){
				init_function = arguments[0];
			} else {
				parent_class = arguments[0];	
			}
		}

		// Create an anonimouse function which initialize a class
		var _class = function(){
			if (init_function){
				init_function.apply(this, arguments);
			}
		};

		// If the parent class is passed in, _class inherits parent's properties and methods 
		if (parent_class){
			_class.prototype = parent_class.prototype; // Inherits parent's properties and methods 
		} 

		_class.fn = _class.prototype;
		_class.fn.parent = _class;

		/**
		 * Basic function for the extend method
		 * @param  {[type]} target    - a target object
		 * @param  {[type]} extention_obj - an object with additional properties and methods
		 */
		function extend(target, extention_obj){
			for (var key in extention_obj){
	    		target[key] = extention_obj[key];
	    	}
		}

	    /**
	     * Adds properties and static methods to the class 
	     * @param  {Object} extention_obj - an object with properties and methods to be added
	     */
	    _class.extend = function(extention_obj){
	        console.log(extention_obj);
	        extend(_class, extention_obj);
	    	/*for (var key in extention_obj){
	    		_class[key] = extention_obj[key];
	    	}*/

	    	console.log(_class);
	    };

	    /**
	     * Adds properties and methods to another object
	     * @param  {Object} target       - a target object
	     * @param  {Object} extention_obj - an object with additional properties and methods	    
	     */
	    /*Class.extend = function(target, extention_obj){
	    	extend(target, extention_obj);
	    };*/

		/**
	     * Adds properties and static methods to the class prototype 
	     * @param  {Object} include_obj - an object with properties and methods to be added to the class prototype
	     */
	    _class.include = function(include_obj){
	     	for (var key in include_obj){
	    		_class.fn[key] = include_obj[key];
	    	}
	    };

	    /**
	     * Basic function for the proxy method
	     * @param  {function} func   - a function
	     * @param  {Object} context - a context
	     * @param  {array} args   - arguments
	     * @return {function}       - 
	     */
	    
	    var proxy = function(func, context, args){
	    	if (args){
		     	return(function(){
		    		return func.apply(context, args);
		    	});
	     	} else {
	     		return(function(){
		    		return func.apply(context);
		    	});
	     	}
	    };

	    
	    /**
	     * Allows any function to be executed in this class object's context 
	     * @param  {function} func - a function
	     * @param  {array} [args] - an array of the function's arguments
	     * @return {function} 
	     */
	    _class.fn.proxy = function(func, args){
	    	var self = this;

	    	console.log(self);

	    	return proxy(func, self, args);	    	
	    }

	    return _class;
	};

	/**
	 * Adds properties and methods to another object
	 * @param  {Object} target        - a target object
	 * @param  {Object} extention_obj - an object with additional properties and methods
	 * @param  {boolean} deep         - true, if it's necessary to copy inner objects and arrays, eitherwise false 	    
	 */
	Class.extend = function(target, extention_obj, deep){
		deep = deep || false;

	   	for (var key in extention_obj){
	   		if (extention_obj.hasOwnProperty(key)){
		   		if (deep){
		   			if (extention_obj[key] instanceof Array){
		   				target[key] = Class.extend([], extention_obj[key], deep);
		   			} else if ((extention_obj[key] instanceof Object) && 
		   				       (!extention_obj[key] instanceof Function)){
		   				target[key] = Class.extend({}, extention_obj[key], deep);
		   			} else {
		   				target[key] = extention_obj[key];
		   			}
		   		} else {
		    		target[key] = extention_obj[key];
		    	}
	    	}
	    }

	    return target;
	};

	/**
	 * Allows any function to be executed in some object's context 
	 * @param  {object} context - context
	 * @param  {function} func - a function
	 * @param  {array} [args] - an array of the function's arguments
	 * @return {function} 
	 */
	Class.proxy = function(func, context, args){
		if (context){
		  	if (args){
			   	return(function(){
			   		return func.apply(context, args);
			   	});
		    } else {
		    	return(function(){
			   		return func.apply(context);
			   	});
		    }
	    } else {
	    	return func;
	    }	    	
	};

})(window);