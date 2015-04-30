(function(window) {

	function Extension(lastAPI) {
		this.lastAPI = lastAPI;
	}

	Extension.prototype.authorise = function() {		

		var authTabId,
			extension = this,

			getSession = function(token) {
				extension.lastAPI.getSession(token, saveSession);	
			},

			saveSession = function(session) {
				localStorage["scrobblerSK"] = session;
			};

		//create a last fm auth tab
		chrome.tabs.create({			
			url: this.lastAPI.getAuthURL() + this.lastAPI.getApiKey() + "&cb=http://vk.com/audio",
			active: true
		}, function(tab) {
			authTabId = tab.id;
		});

		//create the tab onupdate listener, get token, and remove listener after
		chrome.tabs.onUpdated.addListener(function getToken(tabId, changeInfo) {	
			var token;		
			if (tabId == authTabId && changeInfo.status == "loading" && ~changeInfo.url.indexOf("token")) {
				token = changeInfo.url.split("token=")[1];				
				chrome.tabs.onUpdated.removeListener(getToken);	

				//now we have a token and should also get a session
				getSession(token);

			}			
		});		

	}

	Extension.prototype.isAuthorised = function() {
		return !!localStorage["scrobblerSK"];
	};

	Extension.prototype.listen = function() {

		var that = this;

		chrome.runtime.onMessage.addListener(function(message) {
			
			var isAuthorised = that.isAuthorised();

			if (isAuthorised) {				

				if (message.type && message.type === "NP" && message.artist && message.title) {							
					that.lastAPI.updateNowPlaying(message.artist, message.title);
				} 

				if (message.type && message.type === "Scrobbling" && message.artist && message.title) {					;
					that.lastAPI.scrobble(message.artist, message.title);					
				} 

			} 
			
		});

	}

	window.modules = window.modules || {};
	window.modules.Extension = Extension;

})(window);