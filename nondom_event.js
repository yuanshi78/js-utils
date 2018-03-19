/**
 * Publish/Subscriber for custom events on non-DOM elements
 * Aliaksandr Kuzmiankou 元实
 * 2016-10-20
 */

/**
 * Example
 * var Person = new Class();
 *
 * Person.include({sex: "no_sex"});
 * Person.include(PubSub);
 *
 * function displaySex(){
 *	alert(this.sex);
 * }
 *
 * var one_person = new Person();
 * one_person.subscribe("disp_sex", one_person.proxy(displaySex));
 * one_person.publish("disp_sex");
 */
(function(exports){
	// PubSub object which includes the publisher and subscriber
	exports.PubSub = {
		/**
		 * Subscribs for an event and assignes a callback to it  
		 * @param  {string}   cevent   - the event type
		 * @param  {Function} callback - the callback function
		 * @return {Object}            - this
		 */
		subscribe: function(cevent, callback){
			if (!this._callbacks){
				this._callbacks = [];
			}

			(this._callbacks[cevent] || (this._callbacks[cevent] = [])).push(callback);
			return this;
		},

		/**
		 * Triggers (publishes) an event 
		 * @return {Object} - this
		 */
		publish: function(){
			if (!this._callbacks) {
				return this;
			}

			var args = Array.prototype.slice.apply(arguments);
			var cevent = args.shift();
			if (!this._callbacks[cevent]) {
				return this;
			} else {
				for (var i = 0; i < this._callbacks[cevent].length; i++){
					this._callbacks[cevent][i].apply(this, args);
				}	
			}

		}
	};
})(window);
