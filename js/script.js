/*jslint browser:true*/
/*global $, alert*/
var app = {
		title: "Cats Pics",
		version: "1.0.1.0",
		tags: "cat",
		moreButtonLabel: "More Cats &#187;",
		flickrAPIKey: "b4bc32f4bec34c45463aa6c224e56e2e",
		retryFrequency: 5000
	},
	lastPage = 0,
	flickrUrl = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="
		+ app.flickrAPIKey + "&tags=" + app.tags + "&per_page=10&extras=url_o&format=json";

function onImgLoad(e) {
	"use strict";
	$(e.target).removeClass("imgPicsFadingIn").addClass("imgPics");
}

function jsonFlickrApi(data) {
	"use strict";

	var i, img;
	if (data.stat === "ok" && data.photos.photo) {
		for (i = 0; i < data.photos.photo.length; i += 1) {
			if (data.photos.photo[i].farm && data.photos.photo[i].server
					&& data.photos.photo[i].id && data.photos.photo[i].secret) {
				img = $(document.createElement("img"));
				img.addClass("imgPicsFadingIn");
				img.bind("load", onImgLoad);
				$("#divPics").append(img);
				img.attr("src", "http://farm" + data.photos.photo[i].farm
					+ ".staticflickr.com/" + data.photos.photo[i].server
					+ "/" + data.photos.photo[i].id
					+ "_" + data.photos.photo[i].secret + "_m.jpg");
			}
		}
	}
}

function doneLoading() {
	"use strict";
	$("#imgLoad").css("display", "none");
	$("#btnMore").css("display", "inline-block");
	$("#btnRefresh").removeClass().addClass("headerButton");
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
}

function btnMoreClick(e) {
	"use strict";
	$("#btnMore").css("display", "none");
	$("#imgLoad").css("display", "inline-block");
	loadFlickrPhotos();
}

function btnRefreshClick(e) {
	"use strict";
	$("#btnRefresh").removeClass().addClass("headerButtonPressed");
	$("#divPics").empty();
	lastPage = 0;
	btnMoreClick(null);
}

function onLoad() {
	"use strict";
	try {
		document.title = app.title;
		$("#spanHeaderLabel").html(app.title);
		$("#btnMore").html(app.moreButtonLabel);
		$("#btnMore").bind("touchend", btnMoreClick);
		$("#btnMore").bind("click", btnMoreClick);
		$("#btnRefresh").bind("touchend", btnRefreshClick);
		$("#btnRefresh").bind("click", btnRefreshClick);

		btnMoreClick(null);
	} catch (e1) {
		alert("err onload: " + e1);
	}
}

//document.addEventListener("deviceready", function () {
	$(function () {
		onLoad();
	});
//}, false);