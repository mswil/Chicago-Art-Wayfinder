var saveFavorite = function (artwork) {
    //Karsten's code
};

const loadFavorites = function () {
    //Karsten's code
};

const deleteFavorite = function (artwork) {
    const savedFavorites = loadFavorites();

    const newFavorites = savedFavorites.filter(function (savedArtwork) {
        return artwork.id !== savedArtwork.id;
    });
    localStorage.setItem("favoriteArt", JSON.stringify(newFavorites));
};