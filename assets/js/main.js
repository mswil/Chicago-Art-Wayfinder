$(document).ready(main);

$('.dropdown-trigger').dropdown({
  coverTrigger: false,
  constrainWidth: false
})

function main() {
  $('.carousel').carousel();
  $('.sidenav').sidenav();
}

function saveFavorite(artwork) {
  var savedFavorites = loadFavorite();
  savedFavorites.push(artwork);
  localStorage.setItem("favoriteArt", JSON.stringify(savedFavorites));
}

function loadFavorite() {
  var savedFavorites = localStorage.getItem("favoriteArt");
  if (!savedFavorites) {
    return [];
  }
  savedFavorites = JSON.parse(savedFavorites);
  return savedFavorites;
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
