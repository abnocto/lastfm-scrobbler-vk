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

		this.domOperator.setPauseImage();

	}

	VKPlayer.prototype.isPlayerMethodsRedefined = function() {
		return this.playerMethodsRedefined;
	};

	VKPlayer.prototype.isNewTrack = function() {
		return this.isFlashPlayerPlaying() && ( this.id !== this.getId() );
  };

	VKPlayer.prototype.isReadyToScrobble = function() {
		return this.id && this.percent && Number.isFinite( this.percent ) && ( this.percent >= 50 ) && ( !this.isScrobbled );
	};

	VKPlayer.prototype.redrawPlayerImage = function() {
		this.domOperator.redrawPlayerImage(); 
	};	

	VKPlayer.prototype.scrobble = function() {	
		this.isScrobbled = true;
		this.domOperator.setOKImage();
		this.domOperator.setInfo( this.artist, this.track );
	};

	VKPlayer.prototype.setNewTrack = function() {		
		this.id = this.getId();
		this.artist = this.getArtist();
		this.track = this.getTrack(); 
		this.isScrobbled = false;
		this.duration = this.getDuration();
		this.percent = null;					
		this.ribbon = [];
		this.ribbon.length = this.duration;
		this.nowPlayingCounter = -1;
		this.isPlayingNow = true;
		this.domOperator.setPlayImage();		
	};

	VKPlayer.prototype.update = function() {		
		this.ribbon[ this.getTime() ] = true;
		this.percent = Math.round( this.ribbon.filter( e => e ).length * 100 / this.duration );		
	};

	VKPlayer.prototype.updateNowPlaying = function() {			
		this.nowPlayingCounter += 1;
		if ( (this.nowPlayingCounter % 20 === 0) && !this.isScrobbled && this.isPlayingNow ) {
			this.domOperator.setNPInfo(this.artist, this.track);	
		}	
	};


	VKPlayer.prototype.getPlayer = function() {
		//to override
	};	

	VKPlayer.prototype.isPlayer = function() {
		//to override
	};

	VKPlayer.prototype.isFlashPlayerPlaying = function() {
    //to override
  };

	VKPlayer.prototype.getId = function() {
		//to override
	};

	VKPlayer.prototype.getArtist = function() {
		//to override
	};

	VKPlayer.prototype.getTrack = function() {
		//to override
	};

	VKPlayer.prototype.getDuration = function() {
		//to override
	};

	VKPlayer.prototype.getTime = function() {
		//to override
	};

	VKPlayer.prototype.redefinePlayerMethods = function() {		
		//to override
	};

	window.DazzleScrobblerModules.VKPlayer = VKPlayer;

})(window);