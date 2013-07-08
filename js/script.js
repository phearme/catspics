/*jslint browser:true */
var app = {
		title: "Cats Pics",
		version: "1.0.0.7",
		tags: "cat",
		moreButtonLabel: "More Cats &#187;",
		flickrAPIKey: "b4bc32f4bec34c45463aa6c224e56e2e",
		retryFrequency: 5000
	},
	btnMore,
	imgLoad,
	divPics,
	spanHeaderLabel,
	btnRefresh,
	lastPage = 0,
	flickrUrl = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="
		+ app.flickrAPIKey + "&tags=" + app.tags + "&per_page=10&extras=url_o&format=json";

function jsonFlickrApi(data) {
	"use strict";
	var i, img;
	if (data.stat === "ok" && data.photos.photo) {
		for (i = 0; i < data.photos.photo.length; i += 1) {
			if (data.photos.photo[i].farm && data.photos.photo[i].server
					&& data.photos.photo[i].id && data.photos.photo[i].secret) {
				img = document.createElement("img");
				img.setAttribute("src", "http://farm" + data.photos.photo[i].farm
					+ ".staticflickr.com/" + data.photos.photo[i].server
					+ "/" + data.photos.photo[i].id
					+ "_" + data.photos.photo[i].secret + "_m.jpg");
				img.className = "imgPicsFadingIn";
				img.addEventListener("load", function () {
					this.className = "imgPics";
				}, false);
				divPics.appendChild(img);
			}
		}
	}
}

function doneLoading() {
	"use strict";
	imgLoad.style.display = "none";
	btnMore.style.display = "inline-block";
	btnRefresh.className = "headerButton";
}

function loadFlickrPhotos() {
	"use strict";
	lastPage += 1;
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", flickrUrl + "&page=" + lastPage + "&nocache=" + new Date().getTime());
	script.addEventListener("error", function () {
		window.setTimeout(loadFlickrPhotos, app.retryFrequency);
	});
	script.addEventListener("load", doneLoading);
	document.getElementsByTagName("head")[0].appendChild(script);
}

function btnMoreClick() {
	"use strict";
	btnMore.style.display = "none";
	imgLoad.style.display = "inline-block";
	loadFlickrPhotos();
}

function onReady() {
	"use strict";
	btnMore = document.getElementById("btnMoreCats");
	imgLoad = document.getElementById("imgLoad");
	divPics = document.getElementById("divPics");
	spanHeaderLabel = document.getElementById("spanHeaderLabel");
	btnRefresh = document.getElementById("btnRefresh");

	document.getElementsByTagName("title")[0].innerHTML = app.title;
	spanHeaderLabel.innerHTML = app.title;
	btnMore.innerHTML = app.moreButtonLabel;
	btnMore.addEventListener("click", function (e) {
		btnMoreClick();
		e.preventDefault();
	}, false);
	btnRefresh.addEventListener("click", function (e) {
		this.className = "headerButtonPressed";
		divPics.innerHTML = "";
		lastPage = 0;
		btnMoreClick();
		e.preventDefault();
	}, false);

	btnMoreClick();
}

document.addEventListener("deviceready", function () {
	onReady();
}, false);
