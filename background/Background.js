(function() {

	function Background() {
		this.lastAPI = new modules.LastAPI();
		this.extension = new modules.Extension(this.lastAPI);
	}

	var background = new Background();

	window.addEventListener("load", function() {

		var isAuthorised = background.extension.isAuthorised();

		if (!isAuthorised) {
			background.extension.authorise();
		} 	

		background.extension.listen();

	}, false);

})();