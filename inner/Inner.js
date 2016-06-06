(function() {  

	function InnerScript() {		
		this.domOperator = new DazzleScrobblerModules.DOMOperator();
		this.vkPlayer = ( window.location.href.indexOf("new.vk.com") === -1 )
      ? new DazzleScrobblerModules.OldVKPlayer( this.domOperator ) 
      : new DazzleScrobblerModules.NewVKPlayer( this.domOperator );
		this.finder = new DazzleScrobblerModules.Finder( this.vkPlayer );
	}

	var innerScript = new InnerScript();

	innerScript.finder.run();

})();