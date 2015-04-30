(function(window) {

	window.DazzleScrobblerModules = window.DazzleScrobblerModules || {};

	function VKPlayer(domOperator) {

		this.domOperator = domOperator;

		this.playerMethodsRedefined = false;

		this.id = null;
		this.artist = null;
		this.track = null;
		this.isScrobbled = false;
		this.duration = null;
		this.percent = null;
		this.ribbon = [];
		this.nowPlayingCounter = -1;
		this.isPlayingNow = false;
		this.scrobblingAvailable = true;
		this.domOperator.setPauseImage();

	}

	VKPlayer.prototype.isNewTrack = function() {
		var player = window.audioPlayer;
		return this.id !== player.id;
	};

	VKPlayer.prototype.isPlayerMethodsRedefined = function() {
		return this.playerMethodsRedefined;
	};

	VKPlayer.prototype.isPlayer = function() {
		return window.audioPlayer && window.audioPlayer.id;
	};

	VKPlayer.prototype.isReadyToScrobble = function() {
		return this.percent && (this.percent >= 50) && (!this.isScrobbled) && this.scrobblingAvailable;
	};

	VKPlayer.prototype.redefinePlayerMethods = function() {		
		
		var player = window.audioPlayer,
			stop = player.stop,
			operate = player.operate,
			that = this;	

		player.stop = function() {	
			that.isPlayingNow = false; 
			if (!that.isScrobbled) {
				that.domOperator.setPauseImage();
			}				
			that.setNewTrack();						
			stop.apply(player, arguments);			
		}

		player.operate = function() {	
			var paused = player.player.paused();
			if (paused) {				
				that.isPlayingNow = true; 
				if (!that.isScrobbled) {
					that.domOperator.setPlayImage();
				}				
			} else {				
				that.isPlayingNow = false;
				if (!that.isScrobbled) {
					that.domOperator.setPauseImage();
				}				
			}						
			operate.apply(player, arguments);
		}

		this.playerMethodsRedefined = true;

	};

	VKPlayer.prototype.redrawPlayerImage = function() {
		this.domOperator.redrawPlayerImage(); 
	};	

	VKPlayer.prototype.scrobble = function() {		
		this.isScrobbled = true;
		this.domOperator.setOKImage();
		this.domOperator.setInfo(this.artist, this.track);
	};

	VKPlayer.prototype.setNewTrack = function() {		
		var player = window.audioPlayer;
		this.id = player.id;
		this.artist = player.lastSong[5];
		this.track = player.lastSong[6];
		this.isScrobbled = false;
		this.duration = player.lastSong[3];	
		this.percent = null;					
		this.ribbon = [];
		this.ribbon.length = this.duration;
		this.nowPlayingCounter = -1;
		this.isPlayingNow = true;
		this.domOperator.setPlayImage();		
	};

	VKPlayer.prototype.update = function() {

		var player = window.audioPlayer,
			alreadyListenedSeconds;

		this.scrobblingAvailable = this.domOperator.isScrobblingAvailable();		

		this.ribbon[player.curTime] = true;

		alreadyListenedSeconds = this.ribbon.filter(function(element) {
			return element;
		}).length;

		this.percent = Math.round(alreadyListenedSeconds * 100 / this.duration);

	};

	VKPlayer.prototype.updateNowPlaying = function() {	

		this.nowPlayingCounter += 1;

		if ((this.nowPlayingCounter % 20 == 0) && !this.isScrobbled && this.isPlayingNow && this.scrobblingAvailable) {
			this.domOperator.setNPInfo(this.artist, this.track);	
		}	

	};

	window.DazzleScrobblerModules.VKPlayer = VKPlayer;

})(window);