(function(window) {

  window.DazzleScrobblerModules = window.DazzleScrobblerModules || {};

  function OldVKPlayer(domOperator) {
    DazzleScrobblerModules.VKPlayer.apply( this, arguments );    
  }

  OldVKPlayer.prototype.__proto__ = DazzleScrobblerModules.VKPlayer.prototype;
  OldVKPlayer.prototype.constructor = OldVKPlayer;

  OldVKPlayer.prototype.getPlayer = function() {
    return window.audioPlayer;
  };  

  OldVKPlayer.prototype.isPlayer = function() {
    return this.getPlayer() && this.getPlayer().id;
  };

  OldVKPlayer.prototype.isFlashPlayerPlaying = function() {
    return !this.getPlayer().player.paused();
  };

  OldVKPlayer.prototype.getId = function() {
    return this.getPlayer().id;
  };

  OldVKPlayer.prototype.getArtist = function() {
    return this.getPlayer().lastSong[5];
  };

  OldVKPlayer.prototype.getTrack = function() {
    return this.getPlayer().lastSong[6];
  };

  OldVKPlayer.prototype.getDuration = function() {
    return this.getPlayer().lastSong[3];
  };

  OldVKPlayer.prototype.getTime = function() {
    return this.getPlayer().curTime;
  };

  OldVKPlayer.prototype.redefinePlayerMethods = function() {   
    
    var player = this.getPlayer();
    var stop = player.stop;
    var operate = player.operate;
    var that = this;  

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

  window.DazzleScrobblerModules.OldVKPlayer = OldVKPlayer;

})(window);