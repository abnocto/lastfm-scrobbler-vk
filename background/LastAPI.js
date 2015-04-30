(function(window) {

	var API_KEY = "d4dac8c2d03c44999a420410df39c36d",
		API_URL = "http://ws.audioscrobbler.com/2.0/",
		AUTH_URL = "http://www.last.fm/api/auth/?api_key=",
		SECRET = "34139baefa4b0a1d2f6e832c5bf0fc1e",

		getDate = function() {
			var date = new Date(),
				dateString;
			dateString = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " ";
			dateString += date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			return dateString;
		}

		getSignature = function(data) {

			var keys = [],
				obj = {},
				i,
				signature = "";

			//Добавление ключей data в массив
			for (i in data) {
				if (data.hasOwnProperty(i)) {
					keys.push(i);
				}
			}

			//Сортировка массива ключей по алфавиту
			keys.sort();

			//Создание объекта с алфавитно отсортированными ключами из data
			keys.forEach(function(element) {
				obj[element] = data[element];
			});

			//Создание строки сигнатуры
			for (i in obj) {
				if (obj.hasOwnProperty(i)) {
					signature += i + obj[i];
				}
			}

			signature += SECRET;			

			signature = md5(signature);

			return signature;

		},

		logInfo = function(res, np) {
			var status,
				artist, artistCorrected,
				track, trackCorrected;

			status = ~res.indexOf('lfm status="ok"');
			if (status) {
				artistCorrected = res.split('<artist corrected="0">');
				artist = (artistCorrected.length > 1) ? artistCorrected[1].split("</artist>")[0] : res.split('<artist corrected="1">')[1].split("</artist>")[0];
				trackCorrected = res.split('<track corrected="0">');
				track = (trackCorrected.length > 1) ? trackCorrected[1].split("</track>")[0] : res.split('<track corrected="1">')[1].split("</track>")[0];
				np ? console.log("Updated Now Playing: " + artist + " - " + track + " " + getDate()) : 
					 console.log("SCROBBLED: " + artist + " - " + track + " " + getDate());
			} else {
				np ? console.log("Update Now Playing ERROR: " + getDate()) : console.log("SCROBBLING ERROR: " + getDate());
			}

		};

	function LastAPI() {}

	LastAPI.prototype.getApiKey = function() {
		return API_KEY;
	};

	LastAPI.prototype.getApiURL = function() {
		return API_URL;
	};

	LastAPI.prototype.getAuthURL = function() {
		return AUTH_URL;
	};

	LastAPI.prototype.getSecret = function() {
		return SECRET;
	};

	LastAPI.prototype.getSession = function(token, callback) {
		var data = {
			method: "auth.getSession",
			api_key: this.getApiKey(),
			token: token
		},
			url = this.getApiURL();

		data["api_sig"] = getSignature(data);

		ajax.get(url, data, function(res) {
			var session = res.split("<key>")[1].split("</key>")[0];
			if (callback) {
				callback(session);
			}
		});

	};

	LastAPI.prototype.scrobble = function(artist, track) {
		var data = {
			method: "track.scrobble",
			api_key: this.getApiKey(),
			sk: localStorage["scrobblerSK"],
			artist: artist,
			track: track,
			timestamp: Math.round(Date.now() / 1000)
		},
			url = this.getApiURL();

		data["api_sig"] = getSignature(data);

		ajax.post(url, data, function(res) {
			logInfo(res);
		});
		
	};

	LastAPI.prototype.updateNowPlaying = function(artist, track) {
		var data = {
			method: "track.updateNowPlaying",
			api_key: this.getApiKey(),
			sk: localStorage["scrobblerSK"],
			artist: artist,
			track: track
		},
			url = this.getApiURL();

		data["api_sig"] = getSignature(data);

		ajax.post(url, data, function(res) {
			logInfo(res, true);
		});

	};

	window.modules = window.modules || {};
	window.modules.LastAPI = LastAPI;

})(window);