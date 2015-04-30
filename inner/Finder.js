(function(window) {

	window.DazzleScrobblerModules = window.DazzleScrobblerModules || {};

	var INTERVAL_FREQUENCY = 1000;		

	function Finder(vkPlayer) {
		this.vkPlayer = vkPlayer;		
	}

	Finder.prototype.run = function() {		

		var mainInterval,
			that = this;				

		mainInterval = setInterval(function() {

			var isNewTrack,
				isOnPlayFinishRedefined,
				isPlayer,	
				isPlayerImageInit,			
				isReadyToScrobble;

			//расположение изображения скробблера
			that.vkPlayer.redrawPlayerImage();

			//вк плеер есть на странице и не пуст?
			isPlayer = that.vkPlayer.isPlayer();			
			if (isPlayer) {				

				//переопределить в первый раз после загрузки некоторые функции вк плеера
				isPlayerMethodsRedefined = that.vkPlayer.isPlayerMethodsRedefined();
				if (!isPlayerMethodsRedefined) {					
					that.vkPlayer.redefinePlayerMethods();
				}

				//новый трек?
				isNewTrack = that.vkPlayer.isNewTrack();
				if (isNewTrack) {
					that.vkPlayer.setNewTrack();					
				}				

				//нужно ли скробблить?
				isReadyToScrobble = that.vkPlayer.isReadyToScrobble();
				if (isReadyToScrobble) {
					that.vkPlayer.scrobble();
				}

				//обновить прослушанный процент и доступность скробблинга
				that.vkPlayer.update();

				//если надо, обновить nowPlaying
				that.vkPlayer.updateNowPlaying();

			} 

		}, INTERVAL_FREQUENCY);

	};
	
	window.DazzleScrobblerModules.Finder = Finder;

})(window);