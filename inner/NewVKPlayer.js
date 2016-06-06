(function(window) {

  window.DazzleScrobblerModules = window.DazzleScrobblerModules || {};

  function NewVKPlayer(domOperator) {
    DazzleScrobblerModules.VKPlayer.apply( this, arguments );
  }

  NewVKPlayer.prototype.__proto__ = DazzleScrobblerModules.VKPlayer.prototype;
  NewVKPlayer.prototype.constructor = NewVKPlayer;

  NewVKPlayer.prototype.getPlayer = function() {
    return window.getAudioPlayer();
  };  

  NewVKPlayer.prototype.isPlayer = function() {
    return true; //new version always has player
  };

  NewVKPlayer.prototype.isFlashPlayerPlaying = function() {
    return this.getPlayer().isPlaying();
  };

  NewVKPlayer.prototype.getId = function() {
    return this.getPlayer().getCurrentAudio()[0];
  };

  NewVKPlayer.prototype.getArtist = function() {
    return this.getPlayer().getCurrentAudio()[4];
  };

  NewVKPlayer.prototype.getTrack = function() {
    return this.getPlayer().getCurrentAudio()[3];
  };

  NewVKPlayer.prototype.getDuration = function() {
    return this.getPlayer().getCurrentAudio()[5];
  };

  NewVKPlayer.prototype.getTime = function() {
    return Math.floor( this.getPlayer().getCurrentProgress() * this.getDuration() );
  };

  NewVKPlayer.prototype.redefinePlayerMethods = function() {   
    
    var player = this.getPlayer();
    var _implPlay  = player._implPlay;
    var _implPause = player._implPause;
    var that = this;  

    player._implPlay = function() { 
      //set as new track if it is not play after pause
      if ( that.isPlayingNow ) {
        that.setNewTrack();
      }
      that.isPlayingNow = true;
      if ( !that.isScrobbled ) {
        that.domOperator.setPlayImage();
      }
      _implPlay.apply( player, arguments );
    };

    player._implPause = function() { 
      that.isPlayingNow = false;
      if ( !that.isScrobbled ) {
        that.domOperator.setPauseImage();
      }
      _implPause.apply( player, arguments );
    };

    this.playerMethodsRedefined = true;

  };

  window.DazzleScrobblerModules.NewVKPlayer = NewVKPlayer;

})(window);