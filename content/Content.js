(function() {

	function Content() {				
		this.connector = new modules.Connector();
	}

	var content = new Content();

	content.connector.appendImages();
	content.connector.appendInners();
	content.connector.listen();

})();