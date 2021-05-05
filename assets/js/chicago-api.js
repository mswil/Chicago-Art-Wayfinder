const searchByHueApiUrl = "https://api.artic.edu/api/v1/artworks/search?fields=id,title,image_id,artist_title,color&query[term][color.h]=";
const searchByKeywordApiUrl = "https://api.artic.edu/api/v1/artworks/search?fields=id,title,image_id,artist_title&q=";

async function searchByHue(hue) {
    const response = await fetch(searchByHueApiUrl + hue);

    if (!response.ok) {
        console.error("chicago api not okay");
        return {};
    }

    const data = await response.json();
    if (!data.data.length) {
        return null;
    }
    const artwork = createArtworkObj(data.data[0]);

    return artwork;
}

const searchByKeyword = async function (keyword) {
    const response = await fetch(searchByKeywordApiUrl + keyword);

    if (!response.ok) {
        console.error("chicago api not okay");
        return {};
    }

    const data = await response.json();

    if (!data.data.length) {
        return null;
    }

    const artwork = createArtworkObj(data.data[0]);

    return artwork;
}

createArtworkObj = function (data) {
    const artwork = {
        id: data.id,
        title: data.title,
        artist: data.artist_title,
        imageUrl: "https://www.artic.edu/iiif/2/" + data.image_id + "/full/843,/0/default.jpg",
    }
    
    return artwork;
};