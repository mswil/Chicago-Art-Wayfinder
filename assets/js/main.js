$(document).ready(function () {
  $('.carousel').carousel();
});

$('.dropdown-trigger').dropdown({
  coverTrigger: false,
  constrainWidth: false
});

$(document).ready(function () {
  $('.sidenav').sidenav();
});




var loadFavorite = function () {
  var savedFavorites = localStorage.getItem("favoriteArt");
  if (!savedFavorites) {
    return [];
  }
  savedFavorites = JSON.parse(savedFavorites);
  return savedFavorites;
}


var saveFavorite = function (artwork) {
  var savedFavorites = loadFavorite();
  savedFavorites.push(artwork);
  localStorage.setItem("favoriteArt", JSON.stringify(savedFavorites));

}

const someArt = [
  {
    artId: 1,
    name: "painting",
    artist: "bob ross"
  },
  {
    artId: 3,
    name: "drawing",
    artist: "little billy"
  }
]

saveFavorite(someArt[0]);
