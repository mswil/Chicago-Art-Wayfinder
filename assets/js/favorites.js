var saveFavorite = function (artwork) {
    //Karsten's code
};

const loadFavorites = function () {
    //Karsten's code
    return [];
};

const deleteFavorite = function (artwork) {
    const savedFavorites = loadFavorites();

    const newFavorites = savedFavorites.filter(function (savedArtwork) {
        return artwork.id !== savedArtwork.id;
    });
    localStorage.setItem("favoriteArt", JSON.stringify(newFavorites));
};

const toggleFavorite = function (artwork) {

    //if an artwork is not in the favorites list, add it
    if (!isFavorited(artwork)) {
        saveFavorite(artwork);
    }
    //if an artwork is in the favorites list, remove it
    else {
        //this is not triggering
        deleteFavorite(artwork);
    }
    displayFavorites()
};

const isFavorited = function (artwork) {
    return loadFavorites().find(function (savedArtwork) {
        return savedArtwork.id === artwork.id;
    })
};

const displayFavorites = function () {
    
}

