/*jslint browser:true*/
/*global $, alert, bindTouchButton*/
var app = {
		title: "Cats Pics",
		version: "1.0.2.1",
		tags: "cat",
		flickrAPIKey: "b4bc32f4bec34c45463aa6c224e56e2e",
		freesoundAPIKey: "f57a71d60c1b46958ca27391574a5f9e",
		retryFrequency: 5000
	},
	lastPage = 0,
	pageSize = 10,
	loadingImages = false,
	flickrUrl = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="
		+ app.flickrAPIKey + "&tags=" + app.tags + "&per_page=" + pageSize + "&extras=url_o&format=json",
	freesoundUrl = "http://www.freesound.org/api/sounds/search?q=" + app.tags + "&api_key="
		+ app.freesoundAPIKey
		+ "&s=created_desc"
		//+ "&f=type:ogg type:mp3 duration:[0 TO 60]"
		+ "&f=duration:[0 TO 20] type:mp3"
		+ "&fields=type,serve&sounds_per_page=" + pageSize + "&format=json&callback=freesoundcallback";

function shuffleArray(a) {
	"use strict";
	var i, t, j;
	for (i = a.length - 1; i > 0; i -= 1) {
		t = a[i];
		j = Math.floor(Math.random() * (i + 1));
		a[i] = a[j];
		a[j] = t;
	}
	return a;
}

function doneLoading() {
	"use strict";
	$("#imgLoad").css("display", "none");
}

function loadSounds() {
	"use strict";
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", freesoundUrl + "&p=" + lastPage + "&nocache=" + new Date().getTime());
	script.addEventListener("error", function () {
		window.setTimeout(loadSounds, app.retryFrequency);
	}, false);
	document.getElementsByTagName("head")[0].appendChild(script);
}

function loadFlickrPhotos() {
	"use strict";
	lastPage += 1;
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", flickrUrl + "&page=" + lastPage + "&nocache=" + new Date().getTime());
	script.addEventListener("error", function () {
		window.setTimeout(loadFlickrPhotos, app.retryFrequency);
	}, false);
	script.addEventListener("load", doneLoading, false);
	document.getElementsByTagName("head")[0].appendChild(script);
	loadSounds();
}

function onImgLoad(e) {
	"use strict";
	$("#divPics").append($(e.target));
	$(e.target).fadeIn();
}

function onImgClick(e) {
	"use strict";
	if (app.sounds) {
		var id = window.parseInt($(e.target).attr("id").replace("img", ""), 10),
			sound = app.sounds[id];
		console.log(id, sound);
		if (sound) {
			$("#audio_main").unbind("canplay");
			$("#audio_main")[0].pause();
			$("#audio_main").attr("src", sound.serve + "?api_key=" + app.freesoundAPIKey);
			$("#audio_main")[0].load();
			$("#audio_main").bind("canplay", function () {
				$("#audio_main")[0].play();
			});
		}
	}
}

function jsonFlickrApi(data) {
	"use strict";
	var i, img;
	if (data.stat === "ok" && data.photos.photo) {
		for (i = 0; i < data.photos.photo.length; i += 1) {
			if (data.photos.photo[i].farm && data.photos.photo[i].server
					&& data.photos.photo[i].id && data.photos.photo[i].secret) {
				img = $(document.createElement("img"));
				img.attr("id", "img" + (((lastPage - 1) * pageSize) + i).toString());
				img.addClass("imgPics");
				img.hide();
				img.bind("load", onImgLoad);
				img.attr("src", "http://farm" + data.photos.photo[i].farm
					+ ".staticflickr.com/" + data.photos.photo[i].server
					+ "/" + data.photos.photo[i].id
					+ "_" + data.photos.photo[i].secret + "_m.jpg");
				bindTouchButton(img, {
					btnClass: "imgPics",
					btnClassPressed: "imgPicsPressed",
					onAction: onImgClick
				});
				//img.bind("click", onImgClick);
			}
		}
		loadingImages = false;
	} else {
		window.setTimeout(loadFlickrPhotos, app.retryFrequency);
	}
}

function freesoundcallback(data) {
	"use strict";
	var shuffledData = shuffleArray(data.sounds);
	if (!app.sounds) {
		app.sounds = shuffledData;
	} else {
		app.sounds = app.sounds.concat(shuffledData);
	}
}

function getMore() {
	"use strict";
	if (!loadingImages) {
		loadingImages = true;
		$("#imgLoad").css("display", "inline-block");
		loadFlickrPhotos();
	}
}

function btnRefreshClick() {
	"use strict";
	$("#divPics").empty();
	lastPage = 0;
	getMore();
}

function onScroll() {
	"use strict";
	if ($(window).scrollTop() >= $(document).height() - $(window).height() - 50) {
		getMore();
	}
}

function onLoad() {
	"use strict";
	try {
		document.title = app.title;
		$("#spanHeaderLabel").html(app.title);
		bindTouchButton($("#btnRefresh"), {
			btnClass: "headerButton",
			btnClassPressed: "headerButtonPressed",
			onAction: btnRefreshClick
		});

		$(window).bind("scroll", onScroll);

		getMore();
	} catch (e1) {
		alert("err onload: " + e1);
	}
}

document.addEventListener("deviceready", function () {
	"use strict";
	$(function () {
		onLoad();
	});
}, false);