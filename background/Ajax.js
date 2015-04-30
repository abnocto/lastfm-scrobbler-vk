(function(window) {

	var formatData = function(data) {
		var formated = "";
		for (var key in data) {
			if (data.hasOwnProperty(key)) {					
				formated += key + "=" + encodeURIComponent(data[key]) + "&";					
			}
		}		
		return formated.substring(0, formated.length - 1);		
	}

	function Ajax() {	
		this.xhr = new XMLHttpRequest();
	}

	Ajax.prototype.get = function(url, data, callback) {

		var url = url + "?" + formatData(data);

		var xhr = this.xhr;

		xhr.open("GET", url);	
		xhr.onload = function() {
			if (callback) callback(xhr.responseText);
		}
		xhr.send("");

	}

	Ajax.prototype.post = function(url, data, callback) {		

		var data = formatData(data);

		var xhr = this.xhr;

		xhr.open("POST", url);	
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (callback) callback(xhr.responseText);
		}
		xhr.send(data);

	}

	window.ajax = new Ajax();

})(window)