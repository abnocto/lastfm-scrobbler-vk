(function(window) {

	window.modules = window.modules || {};

	var INTERVAL_FREQUENCY = 1000,

	sendMessage = function(message) {
		chrome.runtime.sendMessage(null, message);
	};

	function Connector() {		

		this.inners = [
			"inner/DOMOperator.js",      
	        "inner/VKPlayer.js", 
	        "inner/Finder.js", 
	        "inner/Inner.js"
		];

		this.images = {
			DazzleScrobblerPlaySrc: "img/scrobbling.gif",
	        DazzleScrobblerOffSrc: "img/scrobblerOff.png",
	        DazzleScrobblerPauseSrc: "img/scrobbler.png",
	        DazzleScrobblerOKSrc: "img/scrobblerOK.png"
	    };

	}

	Connector.prototype.appendImages = function() {

		var i,
			span;

		for (i in this.images) {
			if (this.images.hasOwnProperty(i)) {
				span = document.createElement("span");
				span.style.display = "none";
				span.id = i;
				span.innerHTML = chrome.extension.getURL(this.images[i]);
				document.body.appendChild(span);
			};
		}

	}

	Connector.prototype.appendInners = function() {

		this.inners.forEach(function(element) {

			var script = document.createElement("script");
				script.src = chrome.extension.getURL(element);
				//scripts have to be loaded in right order
				script.async = false;
			document.head.appendChild(script);

		});

	};

	Connector.prototype.getData = function(scrobble) {

		var artistSpan,
			titleSpan,
			artist,
			title,
			artistId,
			titleId;

		artistId = scrobble ? "DazzleScrobblerArtistSpan" : "DazzleScrobblerArtistNPSpan";
		titleId = scrobble ? "DazzleScrobblerTitleSpan" : "DazzleScrobblerTitleNPSpan";

		artistSpan = document.getElementById(artistId);
		titleSpan = document.getElementById(titleId);		

		if (artistSpan && artistSpan.innerText && titleSpan && titleSpan.innerText) {
			artist = artistSpan.innerText; //VERY IMPORTANT - innerText, not innerHTML because of mnemonics			
			title = titleSpan.innerText;			
			artistSpan.innerHTML = null; //set spans to null
			titleSpan.innerHTML = null;
			return {artist: artist, title: title};
		} else {
			return false;
		}

	};

	Connector.prototype.listen = function() {

		var mainInterval,
			that = this;

		mainInterval = setInterval(function() {

			isNowPlayingNeed = that.getData(false); 

			if (isNowPlayingNeed) {												
				sendMessage({
					type: "NP",
					artist: isNowPlayingNeed.artist,
					title: isNowPlayingNeed.title
				});
			}

			isScrobblingNeed = that.getData(true); 

			if (isScrobblingNeed) {								
				sendMessage({
					type: "Scrobbling",
					artist: isScrobblingNeed.artist,
					title: isScrobblingNeed.title
				});
			}

		}, INTERVAL_FREQUENCY);

	};

	Connector.prototype.paintIcons = function() {
		this.domPainter.paint();
	};

	window.modules.Connector = Connector;

})(window);