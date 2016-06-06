(function(window) {	

	window.DazzleScrobblerModules = window.DazzleScrobblerModules || {};
	
	var getImagesSrc = function(type) {
		var imagesElements = {
			pause: "DazzleScrobblerPauseSrc",
			play: "DazzleScrobblerPlaySrc",
			ok: "DazzleScrobblerOKSrc",
			off: "DazzleScrobblerOffSrc"
		},
			src = null,
			elem;
		
		elem = document.getElementById(imagesElements[type]);
		if (elem) {
			src = elem.innerHTML;
		}
		return src;
	},

	createInfoSpan = function(id) {
		var span = document.createElement("span");
			span.style.display = "none";
			span.setAttribute("id", id);
			span.innerHTML = null;
		document.body.appendChild(span);
		return span;
	},

	createImage = function() {
		var img = document.createElement("img");
		img.id = "DazzleScrobblerImageElement";
		return img;
	};

	function DOMOperator() {

		var that = this;		

		this.artistSpan = createInfoSpan("DazzleScrobblerArtistSpan");
		this.artistNPSpan = createInfoSpan("DazzleScrobblerArtistNPSpan");
		this.titleSpan = createInfoSpan("DazzleScrobblerTitleSpan");
		this.titleNPSpan = createInfoSpan("DazzleScrobblerTitleNPSpan");		

		this.scrobblingAvailable = true;		

		this.image = createImage();	
		this.image.addEventListener("click", function() {			
			that.toggleScrobbling();
		}, false);

	}

	//переопределение положения изображения скробблера в зависимости от открытой страницы
	DOMOperator.prototype.redrawPlayerImage = function() {		
		
		var oldAC  = document.querySelector("#ac .title_wrap");
		var oldGP  = document.getElementById("gp_small");
		var newTOP = document.querySelector(".top_audio_player");
		var isPlayerAppended, extra, volume;		

		if ( oldAC ) {
			isPlayerAppended = oldAC.querySelector("#" + this.image.id);

			//position (depends on ac_add button ("+"))
			extra  = document.querySelector(".extra_ctrls");
			volume = document.querySelector("#ac_vol");
			this.image.style.right = parseInt( getComputedStyle( extra ).width ) + parseInt( getComputedStyle( volume ).width ) / 2 + "px";			
			
			if ( !isPlayerAppended ) {
				oldAC.appendChild( this.image );	
			}	

		} else if ( oldGP ) {
			isPlayerAppended = oldGP.querySelector("#" + this.image.id);	

			//position
			this.image.style.right = 0;		

			if ( !isPlayerAppended ) {
				oldGP.appendChild( this.image );	
			}

		} else if ( newTOP ) {
			isPlayerAppended = newTOP.querySelector("#" + this.image.id);

			if ( !isPlayerAppended ) {
				newTOP.appendChild( this.image );	
			}

		}

	};

	DOMOperator.prototype.isPlayerImageInit = function() {
		return this.playerImageInit;	
	};

	DOMOperator.prototype.isScrobblingAvailable = function() {
		return this.scrobblingAvailable;	
	};

	DOMOperator.prototype.setInfo = function(artist, title) {
		this.artistSpan.innerHTML = artist;
		this.titleSpan.innerHTML = title;		
	};

	DOMOperator.prototype.setNPInfo = function(artist, title) {
		this.artistNPSpan.innerHTML = artist;
		this.titleNPSpan.innerHTML = title;		
	};

	DOMOperator.prototype.setOffImage = function() {
		this.image.src = getImagesSrc("off");
	};

	/* setOKImage, setPauseImage, setPlayImage:
	*  если скробблинг выключен, то картинка не изменится, но сохранится в "последнюю"
	*  для того, чтобы, если скробблинг будет опять включен, отобразилась последняя актуальная 
	*/
	DOMOperator.prototype.setOKImage = function() {
		if (this.scrobblingAvailable) {
			this.image.src = getImagesSrc("ok");
		} else {
			this.lastSrc = getImagesSrc("ok");
		}		
	};

	DOMOperator.prototype.setPauseImage = function() {
		if (this.scrobblingAvailable) {
			this.image.src = getImagesSrc("pause");
		} else {
			this.lastSrc = getImagesSrc("pause");
		}	
	};

	DOMOperator.prototype.setPlayImage = function() {
		if (this.scrobblingAvailable) {
			this.image.src = getImagesSrc("play");
		} else {
			this.lastSrc = getImagesSrc("play");
		}	
	};

	DOMOperator.prototype.toggleScrobbling = function() {	

		var scrobblingAvailable = this.isScrobblingAvailable();			

		if (scrobblingAvailable) {
			this.lastSrc = this.image.src;
			this.setOffImage();
		} else {
			this.image.src = this.lastSrc;
		}

		this.scrobblingAvailable = !this.scrobblingAvailable;

	};
	
	window.DazzleScrobblerModules.DOMOperator = DOMOperator;

})(window);