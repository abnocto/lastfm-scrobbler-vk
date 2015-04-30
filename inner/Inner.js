(function() {

	function InnerScript() {		
		this.domOperator = new DazzleScrobblerModules.DOMOperator();
		this.vkPlayer = new DazzleScrobblerModules.VKPlayer(this.domOperator);
		this.finder = new DazzleScrobblerModules.Finder(this.vkPlayer);
	}

	var innerScript = new InnerScript();

	innerScript.finder.run();

})();