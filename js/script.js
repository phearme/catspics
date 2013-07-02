/*jslint browser:true */
var app = {
		title: "Cats Pics",
		version: "1.0.0.1",
		tags: "cat",
		moreButtonLabel: "More Cats &#187;",
		flickrAPIKey: "b4bc32f4bec34c45463aa6c224e56e2e"
	},
	btnMore = document.getElementById("btnMoreCats"),
	imgLoad = document.getElementById("imgLoad"),
	divPics = document.getElementById("divPics"),
	spanHeaderLabel = document.getElementById("spanHeaderLabel"),
	btnRefresh = document.getElementById("btnRefresh"),
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
				img.setAttribute("class", "imgPics");
				divPics.appendChild(img);
			}
		}
	}
	imgLoad.style.display = "none";
	btnMore.style.display = "inline-block";
}

function loadFlickrPhotos() {
	"use strict";
	lastPage += 1;
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", flickrUrl + "&page=" + lastPage + "&nocache=" + new Date().getTime());
	document.getElementsByTagName("head")[0].appendChild(script);
}

function btnMoreClick() {
	"use strict";
	btnMore.style.display = "none";
	imgLoad.style.display = "inline-block";
	loadFlickrPhotos();
}

document.getElementsByTagName("title")[0].innerHTML = app.title;
spanHeaderLabel.innerHTML = app.title;
btnMore.innerHTML = app.moreButtonLabel;
btnMore.addEventListener("click", btnMoreClick, false);
btnRefresh.addEventListener("click", function () {
	divPics.innerHTML = "";
	btnMoreClick();
}, false);
btnMoreClick();