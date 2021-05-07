const toggleFavorite = function (artwork) {

    //if an artwork is not in the favorites list, add it
    if (!isFavorited(artwork)) {
        saveFavorite(artwork);
        $("#modal").find("#fav-btn").text("Unfavorite");
    }
    //if an artwork is in the favorites list, remove it
    else {
        //
        deleteFavorite(artwork);
        $("#modal").find("#fav-btn").text("Favorite");
    }
    displayFavorites()
};

const isFavorited = function (artwork) {
    return loadFavorites().find(function (savedArtwork) {
        return savedArtwork.id === artwork.id;
    })
};

const displayFavorites = function () {
    let favorites = loadFavorites();
    $("#favorites").empty();

    if (favorites.length) {
        $("#favorites").append("<div class='row title'><h4>Favorites:</h4></div>");
        $("#favorites").append("<div class='row content'></div>");
        
        const row = $("#favorites").find(".content");
        for (let favorite of favorites) {
            row.append(populateFavoriteCard(favorite));
        };
        
    }
}

const populateFavoriteCard = function (artwork) {
    const template = $($("#favorite-card-template").html());
    //give id to find for removal later
    template.find("#card").parent().attr("id", artwork.id);
    template.find("img").addClass('card-img').attr("src", artwork.imageUrl);

    template.on("click", function () {
        showModal(artwork);
    });
    return template;
};

var saveFavorite = function (artwork) {
    const savedFavorites = loadFavorites();
    savedFavorites.push(artwork);

    localStorage.setItem("favoriteArt", JSON.stringify(savedFavorites));
};

const loadFavorites = function () {
    let savedFavorites = localStorage.getItem("favoriteArt");

    if (!savedFavorites) {
        return [];
    }

    savedFavorites = JSON.parse(savedFavorites);
    return savedFavorites;
};

const deleteFavorite = function (artwork) {
    $("#" + artwork.id).remove();
    const savedFavorites = loadFavorites();

    const newFavorites = savedFavorites.filter(function (savedArtwork) {
        return artwork.id !== savedArtwork.id;
    });
    localStorage.setItem("favoriteArt", JSON.stringify(newFavorites));
};
